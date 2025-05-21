package com.nativelocationtracking

import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import android.app.NotificationManager
import android.app.NotificationChannel
import android.os.Build
import androidx.core.content.ContextCompat
import android.content.pm.PackageManager
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.Priority
import com.google.firebase.firestore.FirebaseFirestore
import android.location.Location
import com.google.firebase.Timestamp
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone
import kotlin.math.atan2
import kotlin.math.PI

class LocationService : Service() {
    private var userId: String? = null
    private val db = FirebaseFirestore.getInstance()
    private val TAG = "LocationService"
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private var previousLocation: Location? = null
    private var lastHeading: Double? = null
    
    // Constants for filtering and heading calculation
    private val MINIMUM_DISTANCE = 0.1f  // Minimum distance in meters for updates
    private val MAX_ACCURACY = 1.0f    // Maximum acceptable accuracy in meters

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "Service onCreate called")
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        locationCallback = object : LocationCallback() {
    override fun onLocationResult(locationResult: LocationResult) {
    val location = locationResult.lastLocation ?: run {
        Log.w(TAG, "Location result was null")
        return
    }
    
    Log.d(TAG, "RAW LOCATION UPDATE: lat=${location.latitude}, lon=${location.longitude}, accuracy=${location.accuracy}m, provider=${location.provider}, time=${location.time}")
    
    // Calculate heading using the previous location
    val heading = calculateHeading(previousLocation, location)
    
    // Upload location with heading
    uploadLocationToFirebase(location, heading)
    
    // Update previous location for the next calculation
    previousLocation = location
}
        }
        Log.d(TAG, "Service created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        userId = intent?.getStringExtra("userId")
        val interval = intent?.getLongExtra("interval", 5000L) ?: 5000L // Default to 5s
        Log.d(TAG, "Service onStartCommand called with userId: $userId, interval: $interval ms")

        if (userId == null || !hasLocationPermissions()) {
            Log.e(TAG, "userId or permissions missing, stopping service")
            stopSelf()
            return START_NOT_STICKY
        }

        startForeground(1, createNotification())
        
        // Try to get immediate location first
        if (hasLocationPermissions()) {
            try {
                fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                    if (location != null) {
                        Log.d(TAG, "Initial location: lat=${location.latitude}, lon=${location.longitude}")
                        if (location.accuracy <= MAX_ACCURACY) {
                            previousLocation = location
                            uploadLocationToFirebase(location, null)
                        }
                    } else {
                        Log.d(TAG, "Initial location was null")
                    }
                }
            } catch (e: SecurityException) {
                Log.e(TAG, "Location permission missing for initial location: ${e.message}", e)
            }
        }
        
        startLocationUpdates(interval)
        return START_STICKY
    }

    private fun hasLocationPermissions(): Boolean {
        return ContextCompat.checkSelfPermission(
            this, android.Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun createNotification() = NotificationCompat.Builder(this, "location_channel")
        .setContentTitle("Tracking Location")
        .setContentText("Running in the background")
        .setSmallIcon(android.R.drawable.ic_menu_mylocation)
        .setPriority(NotificationCompat.PRIORITY_LOW)
        .build().also {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    "location_channel",
                    "Location Tracking",
                    NotificationManager.IMPORTANCE_LOW
                )
                getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
                Log.d(TAG, "Notification channel created")
            }
        }

    private fun startLocationUpdates(interval: Long) {
        if (!hasLocationPermissions()) {
            Log.e(TAG, "Permissions missing, stopping service")
            stopSelf()
            return
        }
        
        Log.d(TAG, "Requesting location updates with interval: $interval ms")
        
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, interval)
            .setMinUpdateDistanceMeters(MINIMUM_DISTANCE)
            .setMinUpdateIntervalMillis(interval / 2)
            .setMaxUpdateDelayMillis(interval * 2)
            .build()

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                null // Main thread for simplicity
            )
            Log.d(TAG, "Location updates requested successfully")
        } catch (e: SecurityException) {
            Log.e(TAG, "Location permission missing: ${e.message}", e)
            stopSelf()
        } catch (e: Exception) {
            Log.e(TAG, "Error requesting location updates: ${e.message}", e)
            stopSelf()
        }
    }

    private fun calculateHeading(prevLocation: Location?, currentLocation: Location): Double? {
        if (prevLocation == null) {
            Log.d(TAG, "No previous location, can't calculate heading")
            return lastHeading
        }
        
        val distance = prevLocation.distanceTo(currentLocation)
        Log.d(TAG, "Distance moved: $distance meters")
        
        if (distance < MINIMUM_DISTANCE) {
            Log.d(TAG, "Distance too small for reliable heading, keeping previous: $lastHeading")
            return lastHeading
        }
        
        val deltaY = currentLocation.latitude - prevLocation.latitude
        val deltaX = currentLocation.longitude - prevLocation.longitude
        
        if (deltaX != 0.0 || deltaY != 0.0) {
            val head = atan2(deltaY, deltaX) * (180 / PI)
            val calculatedHeading = if (head >= 0) head else head + 360
            Log.d(TAG, "Calculated new heading: $calculatedHeading degrees")
            lastHeading = calculatedHeading
        } else {
            Log.d(TAG, "No change in coordinates, keeping previous heading: $lastHeading")
        }
        
        return lastHeading
    }

    private fun uploadLocationToFirebase(location: Location, heading: Double?) {
        userId?.let { uid ->
            Log.d(TAG, "FIREBASE UPLOAD ATTEMPT: userId=$uid, lat=${location.latitude}, lon=${location.longitude}, heading=$heading")
            
            val timestamp = Timestamp.now()
            val dateFormat = SimpleDateFormat("MMMM d, yyyy 'at' h:mm:ss a 'UTC'Z", Locale.US)
            dateFormat.timeZone = TimeZone.getTimeZone("GMT+5")
            val formattedTime = dateFormat.format(timestamp.toDate())
            
            val locationData = HashMap<String, Any>().apply {
                put("lat", location.latitude)
                put("long", location.longitude)
                put("updatedAt", timestamp)
                put("formattedTime", formattedTime)
                put("accuracy", location.accuracy)
                heading?.let { put("heading", it) }
            }
            
            db.collection("riders_locations")
                .whereEqualTo("userId", uid)
                .get()
                .addOnSuccessListener { documents ->
                    if (!documents.isEmpty) {
                        val docId = documents.documents[0].id
                        db.collection("riders_locations").document(docId).update(locationData)
                            .addOnSuccessListener {
                                Log.d(TAG, "FIREBASE UPLOAD SUCCESS: Updated document $docId")
                            }.addOnFailureListener { e ->
                                Log.e(TAG, "FIREBASE UPLOAD FAILED: Error updating document $docId: ${e.message}", e)
                            }
                    } else {
                        locationData["userId"] = uid
                        locationData["createdAt"] = timestamp
                        db.collection("riders_locations").add(locationData)
                            .addOnSuccessListener { docRef ->
                                Log.d(TAG, "FIREBASE UPLOAD SUCCESS: Added new document ${docRef.id}")
                            }.addOnFailureListener { e ->
                                Log.e(TAG, "FIREBASE UPLOAD FAILED: Error adding new document: ${e.message}", e)
                            }
                    }
                }
                .addOnFailureListener { e ->
                    Log.e(TAG, "FIREBASE QUERY FAILED: Error querying riders_locations: ${e.message}", e)
                }
        } ?: Log.e(TAG, "userId is null, cannot upload location")
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            fusedLocationClient.removeLocationUpdates(locationCallback)
            Log.d(TAG, "Location updates stopped")
        } catch (e: Exception) {
            Log.e(TAG, "Error removing location updates: ${e.message}", e)
        }
        stopForeground(true)
        Log.d(TAG, "Service destroyed")
    }

}