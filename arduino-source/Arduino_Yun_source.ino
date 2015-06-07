/*

  Most Arduinos have an on-board LED you can control. On the Uno and
  Leonardo, it is attached to digital pin 13. If you're unsure what
  pin the on-board LED is connected to on your Arduino model, check
  the documentation at http://arduino.cc

 */
// Header Files
#include <Bridge.h>
#include <HttpClient.h>
// 3rd party Json parsing library for arduino devices
#include <ArduinoJson.h>

// Declarations
int red = 8;
int blue = 9;
int yellow = 10;
// manual request call with a push button as input
int pushButton = 2;
// timer to automate request call
unsigned long startAt;

// The setup function runs once when you press reset or power the board
void setup() {
  // Initialize LEDs as digital outputs and set them off.
  pinMode(red, OUTPUT);
  pinMode(blue, OUTPUT);
  pinMode(yellow, OUTPUT);
  digitalWrite(red, LOW);
  digitalWrite(blue, LOW);
  digitalWrite(yellow, LOW);
  
  // Initialize push button as digital input  
  pinMode(pushButton, INPUT);
  
  // Main processor - wifi/ethernet module communication start
  Bridge.begin();
  // open port between processor wifi/ehernet module
  Serial.begin(9600);
  while(!Serial);
  // initialize timer
  startAt = millis();
}

// the loop function runs over and over again forever
void loop() {

  HttpClient client;
  
  char resp[128];
  int i=0;  
  
  if (((millis() - startAt) > 6000) || (digitalRead(pushButton) == HIGH)) {
    client.get("http://pitstop15.herokuapp.com/api/v1/get/keys/arduino-color");
    
    while(client.available()) {
      char c = client.read();
      // prints key
      Serial.print(c);
      // assign it to char array
      resp[i] = c;
      i = (i + 1) % 128;
    }
    
    // notify that char array has ended 
    resp[i] = '\0';
    
    
    if (!strcmp(resp, "{\"key\":\"arduino-color\",\"value\":\"red\"}")) {
      /* red led */
      digitalWrite(red, HIGH);
      digitalWrite(blue, LOW);
      digitalWrite(yellow, LOW);
    } 
    else if (!strcmp(resp, "{\"key\":\"arduino-color\",\"value\":\"blue\"}")) {
     
      /* blue led */
      digitalWrite(red, LOW);
      digitalWrite(blue, HIGH);
      digitalWrite(yellow, LOW);
    }
    else if (!strcmp(resp, "{\"key\":\"arduino-color\",\"value\":\"yellow\"}")) {
     
      /* yellow led */
      digitalWrite(red, LOW);
      digitalWrite(blue, LOW);
      digitalWrite(yellow, HIGH);
    }
    else {
     
      /* turn off all leds */
      digitalWrite(red, LOW);    
      digitalWrite(blue, LOW);
      digitalWrite(yellow, LOW);
    }
    
    // reset char array to starting index
    resp[0] = '\0';
    
    /* allows button to be pressed for 2 secs without interference of the pulse nature
       of the button (when egde falls, states goes back to LOW  */
    delay(2000);
    
    // reset timer
    startAt = millis();
  }  
}
