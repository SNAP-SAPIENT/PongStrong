const int inputPins[] = { 9, 10, 11, 12 };
const int analogPins[] = { A0, A1, A2, A3, A4, A5 };
const int inputCount = 4;
int time = 0;

// these variables will change:
int sensorReading = 0; // variable to store the value read from the sensor pin
long sensorTimes[] = { 0, 0, 0, 0, 0 };
int sensorValues[] = { 0, 0, 0, 0, 0 };

// Detect buffer vars
bool isDetecting = false;
// Longs because the milis() returns longs
long detectLimit = 150;
long detectStart = 0;

bool alreadyPrinted = false;

void setup() {
  Serial.begin(115200); // use the serial port
  for (int i = 0; i < inputCount; i++) {
    pinMode(inputPins[i], INPUT);
  }
}

void setSensorTimes() {
  // read the sensor and store it in the variable sensorReading:
  for (int i = 0; i < inputCount; i++) {
    if (digitalRead(inputPins[i]) == HIGH && sensorTimes[i] == 0) {
      Serial.print(i);
      Serial.print(" : ");
      Serial.println(millis());
      if (isDetecting == false) {
        isDetecting = true;
        detectStart = millis();
      }
      sensorTimes[i] = micros();
    }
  }
}

void printSensorTimes() {
  alreadyPrinted = true;
//  for (int i = 0; i < inputCount; i++) {
//    Serial.print(inputPins[i]);
//    Serial.print(" , ");
//    Serial.print(sensorValues[i]);
//    Serial.print(" , ");
//    Serial.print(sensorTimes[i]);
//    Serial.print("  _  ");
//  }
//
//  Serial.print("9 : ");
//  Serial.println(sensorTimes[0]);

//  Serial.print("10 : ");
//  Serial.println(sensorTimes[1]);
//
//  Serial.print("11 : ");
//  Serial.println(sensorTimes[2]);
  
//  Serial.print("9 - 10  :  ");
//  Serial.println(sensorTimes[0] - sensorTimes[1]);
//  
//  Serial.print("10 - 11  :  ");
//  Serial.println(sensorTimes[1] - sensorTimes[2]);
//  
//  Serial.print("11 - 9  :  ");
//  Serial.println(sensorTimes[2] - sensorTimes[0]);
  // Serial.print(sensorTimes[0] - sensorTimes[1]); 
  Serial.println("");
}

bool shouldReset() {
  return (millis() - detectStart) > detectLimit;
}

void resetSensorTimes() {
  for (int i = 0; i < inputCount; i++) {
    sensorTimes[i] = 0; 
  }
}

void loop(){
  setSensorTimes();

  bool shouldPrint = true;
  for (int i = 0; i < inputCount; i++) {
    if (sensorTimes[i] == 0) {
      shouldPrint = false;
    }
  }

  if (shouldPrint && !alreadyPrinted) {
    printSensorTimes();
  }

  if (isDetecting && shouldReset()) {
    isDetecting = false;
    alreadyPrinted = false;
    resetSensorTimes();
  }
}
