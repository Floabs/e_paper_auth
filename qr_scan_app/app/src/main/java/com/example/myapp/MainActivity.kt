package com.example.myapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.myapp.ui.theme.MyappTheme
import com.google.zxing.integration.android.IntentIntegrator
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class MainActivity : ComponentActivity() {

    // Replace with your backend endpoint
    private val backendUrl = "http://your-backend-url/api/verify"
    private val client = OkHttpClient()

    // State for the scanned QR code data
    private var scannedData = mutableStateOf("")

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyappTheme {
                Scaffold(
                    topBar = {
                        TopAppBar(title = { Text("QR Code Scanner App") })
                    }
                ) { innerPadding ->
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                            .padding(16.dp),
                        verticalArrangement = Arrangement.Center
                    ) {
                        Button(
                            onClick = { scanQRCode() },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Scan QR Code")
                        }
                        Spacer(modifier = Modifier.height(20.dp))
                        if (scannedData.value.isNotEmpty()) {
                            Text(text = "Scanned Data: ${scannedData.value}")
                        }
                    }
                }
            }
        }
    }

    private fun scanQRCode() {
        // Use ZXing's IntentIntegrator to launch the scanning activity.
        val integrator = IntentIntegrator(this)
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE) // Scan only QR codes
        integrator.setPrompt("Scan a QR Code")
        integrator.setBeepEnabled(true)
        integrator.setOrientationLocked(true)
        integrator.initiateScan()
    }

    // Receive the scanning result.
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        val result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result != null) {
            if (result.contents == null) {
                Log.d("QRScanner", "Scan cancelled")
            } else {
                scannedData.value = result.contents
                Log.d("QRScanner", "Scanned: ${result.contents}")
                // Send the scanned data to your backend.
                sendDataToBackend(result.contents)
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    // Function to send a POST request with the scanned QR code data.
    private fun sendDataToBackend(scannedData: String) {
        val json = JSONObject().apply {
            put("qrData", scannedData)
        }
        val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder()
            .url(backendUrl)
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("HTTP", "Failed to send data: ${e.message}")
            }
            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    Log.d("HTTP", "Data sent successfully: ${response.body?.string()}")
                } else {
                    Log.e("HTTP", "Error sending data: ${response.code}")
                }
            }
        })
    }
}
