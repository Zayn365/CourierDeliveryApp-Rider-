package com.nativelocationtracking

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.nativelocationtracking.NativeLocationTrackingSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

@ReactModule(name = NativeLocationTracking.NAME)
class NativeLocationTracking(reactContext: ReactApplicationContext) :
    NativeLocationTrackingSpec(reactContext) {

    companion object {
        const val NAME = "NativeLocationTracking"
    }

    private val context = reactContext
    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(reactContext)

    override fun startBackgroundTracking(interval: Double) {
        if (hasLocationPermission()) {
            val intent = Intent(context, LocationService::class.java).apply {
                putExtra("interval", interval.toLong())
            }
            context.startForegroundService(intent)
        }
    }

    override fun stopBackgroundTracking() {
        context.stopService(Intent(context, LocationService::class.java))
    }

    override fun getCurrentPosition(promise: Promise) {
    if (!hasLocationPermission()) {
        val result = Arguments.createMap().apply {
            putDouble("latitude", 0.0)
            putDouble("longitude", 0.0)
        }
        promise.resolve(result)
        return
    }
    fusedLocationClient.lastLocation
        .addOnSuccessListener { location ->
            if (location != null) {
                val result = Arguments.createMap().apply {
                    putDouble("latitude", location.latitude)
                    putDouble("longitude", location.longitude)
                }
                promise.resolve(result)
            } else {
                promise.resolve(Arguments.createMap().apply {
                    putDouble("latitude", 0.0)
                    putDouble("longitude", 0.0)
                })
            }
        }
        .addOnFailureListener { e ->
            promise.reject("LOCATION_ERROR", e.message)
        }
}

    private fun hasLocationPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            context, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED ||
               ContextCompat.checkSelfPermission(
                   context, Manifest.permission.ACCESS_COARSE_LOCATION
               ) == PackageManager.PERMISSION_GRANTED
    }
}