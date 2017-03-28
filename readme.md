# IoT Demo
This is a demo of IoT capabilities in Azure using IoT Hubs, Service Bus and Azure Function Apps.  
Messages received at the IoT hub are placed on a Service Bus queue, from the queue they are picked up by the Azure Function and placed into blob storage as CSV files and into a table.

![screenshot](https://cloud.githubusercontent.com/assets/14982936/24415800/96713852-13da-11e7-941b-ebf1607a57dc.png)

The provided device simulator is written in Node.js and sends simple JSON messages including randomised wind speed data
This is just example functionality, the Azure Function could carry out any processing you desire


## Deployment
Use supplied [azuredeploy.json](azuredeploy.json) ARM template to deploy everything into Azure.  
Please ensure you provide globally unique names for the IoT Hub, Function App and Service Bus, these are template parameters.  
Deployed resources:
* **IoT Hub** plus routes and Service Bus endpoints
* **Service Bus** and demo **queue**, plus send & listen access keys
* **Function App** plus **App Service Plan**, function *(iotEventsDemo)* will be auto deployed from this Github repo, and connected to the Service Bus
* **Storage Account** used by the Function App


## Usage
After deployment the ARM template will provide four outputs:
* `iotHubHostname`
* `iotHubAccessKey`
* `iotHubConnStr`
* `storageAccountName`
* `storageAccountKey`

Two small Node.js apps are provided:
* [`RegDevice.js`](RegDevice.js) - Register a new device with the IoT hub and get the device key.
* [`DeviceSimulator.js`](DeviceSimulator.js) - Main device simulator script, sends demo messages on a looping interval.  
After cloning this repo you will need to run `npm install` to install all the dependencies 

Register a new device e.g. *demo-device-1*, with the IoT hub using the connection string (put it in double quotes):
```
node RegDevice.js "{iotHubConnStr}" demo-device-1
```
This will return the key for the new device

Run simulation as follows. Provide IoT hub host name, device-id, the device-key from the last command and also a interval in millisecs
```
node DeviceSimulator.js {iotHubHostname} demo-device-1 {deviceKey} 1000
```
Some helper CMD batch files are provided. Take copies of the *.sample* files and edit the <parameter> sections to match your deployment 


## Cleanup
Either remove the Azure resource group, or run the [cleanup Node.js script](cleanUp.js); providing storage account name and access-key, this will delete all output CSV files and the table output
