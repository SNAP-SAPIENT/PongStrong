const int inputPins[] = { 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 };
const int cells[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 };
const int inputCount = 12;
int time = 0;

// these variables will change:
int sensorReading = 0; // variable to store the value read from the sensor pin
// Longs because the micros() returns longs
long sensorTimes[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

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
  for (int i = 0; i < inputCount; i++) {
    Serial.print(sensorTimes[i]);
    if (i+1 < inputCount) {
      Serial.print(",");
    }
  }
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
