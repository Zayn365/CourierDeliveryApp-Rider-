package com.nativelocationtracking

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

class NativeLocationTracking(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "NativeLocationTracking"
        private const val MIN_INTERVAL_MS = 5000L
    }

    private val context: ReactApplicationContext = reactContext
    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(reactContext)

    override fun getName(): String = "NativeLocationTracking"

    private fun hasLocationPermissions(): Boolean {
        val fineLocation = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        val backgroundLocation = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
        return fineLocation && backgroundLocation
    }

    @ReactMethod
    fun startBackgroundTracking(interval: Double, userId: String, promise: Promise? = null) {
        try {
            if (!hasLocationPermissions()) {
                Log.e(TAG, "Location permissions not granted")
                promise?.reject("PERMISSION_ERROR", "Location permissions not granted")
                return
            }
            val adjustedInterval = interval.toLong().coerceAtLeast(MIN_INTERVAL_MS)
            Log.d(TAG, "Starting background tracking with interval: $adjustedInterval ms, userId: $userId")
            
            val serviceIntent = Intent(context, LocationService::class.java).apply {
                putExtra("interval", adjustedInterval)
                putExtra("userId", userId)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
                Log.d(TAG, "Started foreground service")
            } else {
                context.startService(serviceIntent)
                Log.d(TAG, "Started service")
            }
            promise?.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error in startBackgroundTracking: ${e.message}", e)
            promise?.reject("START_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getCurrentPosition(promise: Promise) {
        if (!hasLocationPermissions()) {
            Log.e(TAG, "Location permissions not granted for getCurrentPosition")
            promise.reject("PERMISSION_ERROR", "Location permissions not granted")
            return
        }
        try {
            Log.d(TAG, "Fetching current position")
            fusedLocationClient.lastLocation
                .addOnSuccessListener { location ->
                    if (location != null) {
                        val result = Arguments.createMap().apply {
                            putDouble("latitude", location.latitude)
                            putDouble("longitude", location.longitude)
                            putDouble("timestamp", location.time.toDouble())
                            putDouble("accuracy", location.accuracy.toDouble())
                        }
                        promise.resolve(result)
                    } else {
                        promise.reject("LOCATION_ERROR", "Unable to retrieve location")
                    }
                }
                .addOnFailureListener { e ->
                    promise.reject("LOCATION_ERROR", e.message)
                }
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_ERROR", "Location permissions revoked")
        }
    }

    @ReactMethod
    fun stopBackgroundTracking() {
        try {
            Log.d(TAG, "Stopping background tracking")
            val serviceIntent = Intent(context, LocationService::class.java)
            context.stopService(serviceIntent)
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping background tracking: ${e.message}", e)
        }
    }
    
}