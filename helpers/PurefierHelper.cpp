// Libraries
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Wifi auth, if difficult use a mobile hotspot
const char* ssid = "wifi_name";
const char* password = "wifi_password";
// API Url
const char* url = "https://metro-students-mobile-apps.onrender.com";
// Loop variables
unsigned long lastCallTime = 0;
const unsigned long interval = 5000; // 5 seconds

/**
 * @brief Sets up the board and connects it to the given WiFi network.
 *
 * This function initializes the serial port, begins the WiFi connection, and
 * waits for the connection to be established. If the connection is successful,
 * it prints a message to the serial console.
 */
void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

}

/**
 * @brief Loop function, this is the main loop of the program. It checks if the
 *        purifier is in manual or automatic mode, and enables or disables
 *        sensors and other things accordingly.
 */
void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastCallTime >= interval) {
    lastCallTime = currentTime;
    if(IsPurifierManual() == true){
      //Disable sensors and stuff here...
    }else{
      //Enable sensors and stuff here...
    }

    //Implement the setting of the air quality
    SetAirQuality("good");
    SetAirQuality("bad");
  }
}

/**
 * @brief Checks if the purifier is in manual mode or not.
 * @returns true if the purifier is in manual mode, false if it is in automatic mode.
 */
bool IsPurifierManual() {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(url + "/purifier/status");
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.GET();
    if(httpCode == 200) {
      String payload = http.getString();
      Serial.println("Response:");
      Serial.println(payload);

      // Parse JSON
      StaticJsonDocument<200> doc;
      deserializeJson(doc, payload);
      const char* status = doc["status"];
      
      if (strcmp(status, "on") == 0) {
        return false;
      } else if (strcmp(status, "off") == 0) {
        return true;
      } else {
        Serial.println("Unknown status");
      }

    } else {
      Serial.printf("HTTP Error: %d\n", httpCode);
    }

    http.end();
  }else{
    Serial.println("No wifi connection...")
  }
  return false; // fallback: standard to automatic if status is unknown.
}

/**
 * @brief Sends a command to set the air quality level of the purifier.
 *
 * This function checks if the WiFi is connected, and if so, it sends a POST
 * request to the purifier's API with the specified command to adjust the air
 * quality. The command is sent as a JSON payload. The function prints the 
 * response or error message to the serial console.
 *
 * @param command A string representing the air quality command to be sent.
 * !!Important: Param command should be either 'good' or 'bad'  
 */
void SetAirQuality(const char* command) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(url) + "/purifier/quality");
    http.addHeader("Content-Type", "application/json");

    // Stel JSON-body samen
    String json = String("{\"command\":\"") + command + "\"}";

    int httpCode = http.POST(json);
    if (httpCode > 0) {
      Serial.printf("POST response code: %d\n", httpCode);
      String response = http.getString();
      Serial.println("Response:");
      Serial.println(response);
    } else {
      Serial.printf("POST failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("No WiFi connection...");
  }
}