+-----------------+        Scans QR Code &
|  Mobile App     |  --------------------->  Sends auth request
| (User’s device) |                            
+-----------------+                              
         |                                       
         |  Receives updated QR code              
         | <---------------------                    
         v                                       
+-------------------------+      Generates dynamic
| Central Server/Backend  |  --------------------->  Sends command to update QR code display
| (Auth, validation, log) |                            
+-------------------------+                              
         |                                       
         | Validates token & issues command      
         v                                       
+--------------------------+                    
| Embedded Device          |  Displays QR code on E-paper 
| (with E-Paper Display)   |  --------------------->  Scanned by Mobile App
+--------------------------+                              
         |                                       
         | Activates door unlock                
         v                                       
+---------------------+                         
| Door Lock Mechanism |                         
+---------------------+                         
         |                                       
         | Logs access events                     
         v                                       
+-------------------------+                    
| Access Log Database     |                    
+-------------------------+

