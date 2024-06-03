#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Servo.h> 

#define WIFI_SSID "A. 11 07."
#define WIFI_PASSWORD "12345678"

Servo servo;

void setup() {
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  Serial.print("Connecting to Wi-Fi");
  
  while (WiFi.status() != WL_CONNECTED){
      Serial.print(".");
      delay(300);
  }

  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  servo.attach(0);
}

void loop() {


  if ((WiFi.status() == WL_CONNECTED)) {
    WiFiClient client;
    HTTPClient http;
    
    String address;
    address ="http://192.168.100.5/check_status?device=lamp";
      
    http.begin(client,address);
    int httpCode = http.GET();
    String payload;  
    if (httpCode > 0) {  
        payload = http.getString();   
        payload.trim();
        if( payload.length() > 0 ){
          if(payload.equals("0")){
            servo.write(0); 
          }else if(payload.equals("1")){
            servo.write(180); 
          }
          Serial.println(payload + "\n");
        }
    }else {
      Serial.print("Error code: ");
      Serial.println(httpCode);
    }
    
    http.end(); 
  }else{
    Serial.print("Not connected to wifi ");Serial.println(WIFI_SSID);
  }
}
