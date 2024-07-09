const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { google } = require('googleapis');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Request = require('./models/Request');
const Connection = require('./models/Connection');
const Notification = require('./models/Notification');
const Video = require('./models/Video');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const apikeys = require('./apikey.json');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require('uuid');
const https = require('https');
const url = require('url');
const path = require('path');
// require("dotenv").config();
const app = express();

mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("Connected to mongodb:cluster1/CarsMernDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
// app.use(cookieParser());

// const upload = multer({ dest: 'uploads/' });

// const apikeys = {
//   client_email: 'test1-511@plucky-pointer-427709-v1.iam.gserviceaccount.com',
//   private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZZtV/+ZyQzMT5\nf4i0Z8t5Ks4qmohIugO/HyAnARdLeRG4JK2JRKrgOX3tl4oAHFR1B8Xg5PcKDaRR\nRe+SumTeMQuW6xhzC51FvUUEAzi4LUlLuWkFj8eK3HKz1o3OAbOos7uzi4F0lacB\nSPvgb9+pq2vMvTJFR9qmTNS+vCCtNSk5os57HFv6nfLzUG+kOhuB2xK1FujinhyF\nCSxoEQ9DAEfUsH8oxQzOm/l2eP6AolHMQw9NUcOheHFAv/QdeoT0BU61z/k+02Dy\nXX3PTbzPPbapI5T315GTFLjIizHc8juY9ymoupNNWefPwZsQ9/mHIYgnah7ow4Cq\nzSi9nukXAgMBAAECggEAIhn7MlTiGkp7K1/PmxNL52a9qDjsPQalGJKpyiHy9MM4\nTjBRJ6fNOMVvGidK9VVW7SFKOwGLbX+03KBobrzi+YX7ppQivkiBsOQveIHi1Qa0\nOZJBJ4xb9qGlGheDNJ2qO8Gg43wKzkkKdD2uSKl2FjjWYRBaIY6kq71+udwGg5pq\nrEAkDqt68Bk/0LJ7lGwTmjp46bZ90Cz2Gz+vfIiGZoTvLyjekrxBOfCjY1MKrhUp\n/b6/4uk1w5AJffm2YigeLNNCFt5UMWsXw3/zXB/X/nhyhOOzxAKpYLrq4yt1ZQhY\nVkEW98JSOTG5podyzpKd6uWiercM6zM5zgXEVQ7/0QKBgQDKUOuSZCJadU7MIfTp\nhIzMmCoJVHWLMxXblgYAvTysYbh5+YpN+UwPXeQ2STBQHQMBEFxEAAU1nGPEZBfd\nMP6om0TtmeORv4xj5b8PVZB1iFbWzQOiPkl7+NQaj/oNMWi0+xcohE+6s+7ioIsy\nipqmWIy+rfoxmLcJMMCfwDhCmQKBgQDCGzg9W7UCY58Ij358iAXeU5gQoZpT/fVD\nO1jNKeOstwPXscjo0K1WGlsjEMZ51Je0oUAC7ADuuFlqCX7gwMHKKT951Hzb5UZw\nyGA/juRWgYfHAfzUI0aLM7wZn90zWewCB139FfxtPt9qvllDrUuxKcZDC7qK0djk\n4/XTkQyHLwKBgQCLiOPwQz+uQ9nk0EaqB9FUCl5zsNyg9MrOd9oMCHggLAWfmovY\n22ep8YfEKRY5Ksk3oqEABUOShhoJCT+sPm5kuzH+7XQWwZWCEKKFYO4RIcdCvoMT\nEwJ7jlI7P7GmB72/lK2UNC0JB7BqfW+DnDStJcVsfXFhY4JZxFYV1+z1gQKBgBUz\nT+MzvwNxyg7vTUtgt/Negf9fBzIhTMZ5FuvhpWJZ4uuOGXmEQUpkOowL6wGnfKJX\n8lvfVwK709hHDTqTExd3hd1SngiOdDEhUZHfk4T3RNMxnmG1MKFHl0XdNhXDvolC\nMLvRyO5Nra1E+Q7xQJErFOKBx3AeF2h4lYL0FsA1AoGAB/eWsLETXjxrUv7xZCxV\n51xtscMGUCGeYx57ziQ0wkZWiD7IvW5EI37/8rwAIGbSiwWod6GdOF+HRNHF57ZP\nEilyGVIkPskjbXs6atFpYn/oA4bJArr8CBzmtDdsUC/7tBtkp7Ivc+05ahmClzTE\nS297IVYlkSdvAGJxeTXtbE0=\n-----END PRIVATE KEY-----\n",',
// };
// const SCOPE = ['https://www.googleapis.com/auth/drive'];


// function saveImageToDisk(driveUrl, path) {
//   return new Promise((resolve, reject) => {
//     // Extract file ID from Google Drive URL
//     const fileId = driveUrl.match(/\/d\/(.*?)\//);
//     if (!fileId) {
//       reject(new Error('Invalid Google Drive URL'));
//       return;
//     }
//     const directUrl = `https://drive.google.com/uc?export=download&id=${fileId[1]}`;

//     const localPath = fs.createWriteStream(path);
//     https.get(directUrl, (response) => {
//       if (response.statusCode === 302 || response.statusCode === 303) {
//         // If the response is a redirect, follow the redirect
//         https.get(response.headers.location, (redirectedResponse) => {
//           if (redirectedResponse.statusCode !== 200) {
//             reject(new Error(`Failed to download file: ${redirectedResponse.statusCode}`));
//             return;
//           }
//           redirectedResponse.pipe(localPath);
//           redirectedResponse.on('end', () => {
//             console.log('File downloaded successfully');
//             resolve(); // Resolve the promise when download is complete
//           });
//         }).on('error', (err) => {
//           reject(new Error(`Error following redirect: ${err.message}`));
//         });
//       } else if (response.statusCode === 200) {
//         response.pipe(localPath);
//         response.on('end', () => {
//           console.log('File downloaded successfully');
//           resolve(); // Resolve the promise when download is complete
//         });
//       } else {
//         reject(new Error(`Failed to download file: ${response.statusCode}`));
//       }
//     }).on('error', (err) => {
//       reject(new Error(`Error: ${err.message}`));
//     });
//   });
// }
// async function authorize() {
//   const jwtClient = new google.auth.JWT(
//     apikeys.client_email,
//     null,
//     apikeys.private_key,
//     SCOPE
//   );
//   await jwtClient.authorize();
//   return jwtClient;
// }
// async function uploadFile(authClient, filePath, fileName, uniqueFileName) {
//   return new Promise((resolve, reject) => {
//     const drive = google.drive({ version: 'v3', auth: authClient });
//     const fileMetaData = {
//       name: uniqueFileName,
//       parents: ['1R3XLHbZ6YU0j196THSagMeC6W-QKKeSQ'] // Change this to your folder ID
//     };

//     drive.files.create({
//       resource: fileMetaData,
//       media: {
//         body: fs.createReadStream(filePath),
//         mimeType: 'video/mp4'
//       },
//       fields: 'id'
//     }, function (err, file) {
//       if (err) {
//         return reject(err);
//       }
//       resolve(file);
//     });
//   });
// }
// async function generateDownloadLink(authClient, fileId) {
//   const drive = google.drive({ version: 'v3', auth: authClient });
//   await drive.permissions.create({
//     fileId: fileId,
//     requestBody: {
//       role: 'reader',
//       type: 'anyone',
//     }
//   });
//   const result = await drive.files.get({
//     fileId: fileId,
//     fields: 'webViewLink, webContentLink'
//   });
//   return result.data;
// }
// app.post('/upload', upload.single('videoFile'), async (req, res) => {
//   try {
//     const uniqueFileName = `${Date.now()}-${uuid()}.mp4`;
//     const authClient = await authorize();
//     const file = await uploadFile(authClient, req.file.path, req.file.originalname, uniqueFileName);
//     const fileId = file.data.id;
//     const downloadLinks = await generateDownloadLink(authClient, fileId);
//     //------------write here--------------------------//

//     // For the sake of storing video in database
//     const editor_details = await User.findOne({ _id: req.body.editor });
//     const editor_email = editor_details.email;

//     const video = new Video({
//       youtuber: req.body.youtuber,
//       editor: editor_email,
//       editor_name: editor_details.name,
//       video: uniqueFileName,
//       link: downloadLinks.webViewLink,
//       title: req.body.title,
//       description: req.body.description,
//     });
//     await video.save();

//     // Add a notification to Youberzz
//     const notification = new Notification({
//       video: uniqueFileName,
//       youtuber: req.body.youtuber,
//       editor: editor_email,
//       editor_name: editor_details.name
//     });
//     await notification.save();
//     //----------------------------------------------------
//     fs.unlinkSync(req.file.path); // Delete the file from server after upload
//     res.status(200).json({ fileId: fileId, downloadLinks: downloadLinks });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.post('/signup', async (req, res) => {
//   const { name, email, password, role } = req.body;
//   const user = await User.findOne({ email: email });
//   if (user) {
//     return res.status(400).json({ message: "User already exists!" });
//   }

//   const youtuber = new User({
//     name: name,
//     email: email,
//     password: password,
//     type: role
//   });
//   const user_id = youtuber._id;

//   youtuber
//     .save()
//     .then(() => {
//       //now need to store tokens in cookie

//       const token = jwt.sign({ id: user_id, name: name, type: role }, process.env.JWT_SECRET_KEY, {
//         expiresIn: "1hr",
//       });

//       res.cookie('authToken', token, {
//         path: "/",
//         expires: new Date(Date.now() + 1000 * 3600), // 1 hour
//         httpOnly: true,
//         sameSite: "lax",
//         secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
//       });

//       return res.status(200).json({
//         message: "Successfully Logged In",
//         user: youtuber,
//         token,
//       });
//       //---------------------------------------
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).json({ message: "Error Signing Up!" });
//     });
// });
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email: email });

//   if (!user) {
//     return res.status(400).json({ message: "Invalid Email!" });
//   }

//   if (password != user.password) {
//     return res.status(400).json({ message: "Invalid Password!" });
//   }

//   const token = jwt.sign({ id: user._id, name: user.name, type: user.type }, process.env.JWT_SECRET_KEY, {
//     expiresIn: "1hr",
//   });

//   res.cookie('authToken', token, {
//     path: "/",
//     expires: new Date(Date.now() + 1000 * 3600), // 1 hour
//     httpOnly: true,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
//   });

//   return res.status(200).json({
//     message: "Successfully Logged In",
//     user: user,
//     token,
//   });
// })
// app.get('/profile', (req, res) => {
//   const token = req.cookies.authToken;

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }
//     res.json({ id: decoded.id, name: decoded.name, type: decoded.type });
//   });
// });
// app.post('/sendrequest', async (req, res) => {
//   const { id, receiver_id } = req.body;
//   const sender = await User.findOne({ _id: id });
//   const receiver = await User.findOne({ _id: receiver_id });
//   if (!sender || !receiver) {
//     return res.status(400).json({ message: "Any of the user not exists" });
//   }

//   const request = new Request({
//     sender: sender.email,
//     receiver: receiver.email
//   });

//   request
//     .save()
//     .then(() => {
//       return res.status(200).json({ message: 'Request Sent!' });
//     })
//     .catch((err) => {
//       return res.status(500).json({ message: 'Request not Sent!' });
//     });
// });
// app.post('/allusers', async (req, res) => {
//   const { name, id, type } = req.body;
//   const user = await User.findById(id); // Use findById for a single document
//   if (type === 'youtuber') {
//     const all_users = await User.find({ type: 'editor' });
//     const all_notifications = await Request.find({ sender: user.email });
//     const all_connections_initiated = await Connection.find({ sender: user.email });
//     const all_connections_received = await Connection.find({ receiver: user.email });
//     const all_neglected_emails = [
//       ...all_notifications.map(notification => notification.receiver),
//       ...all_connections_initiated.map(connection => connection.receiver),
//       ...all_connections_received.map(connection => connection.sender)
//     ];
//     const all_neglected_users = await User.find({ email: { $in: all_neglected_emails } });
//     const neglectedUserIds = new Set(all_neglected_users.map(user => user._id.toString()));
//     const availableUsers = all_users.filter(user => !neglectedUserIds.has(user._id.toString()));
//     res.json(availableUsers);
//   }
//   else {
//     const all_users = await User.find({ type: 'youtuber' });
//     const all_notifications = await Request.find({ sender: user.email });
//     const all_connections_initiated = await Connection.find({ sender: user.email });
//     const all_connections_received = await Connection.find({ receiver: user.email });
//     const all_neglected_emails = [
//       ...all_notifications.map(notification => notification.receiver),
//       ...all_connections_initiated.map(connection => connection.receiver),
//       ...all_connections_received.map(connection => connection.sender)
//     ];
//     const all_neglected_users = await User.find({ email: { $in: all_neglected_emails } });
//     const neglectedUserIds = new Set(all_neglected_users.map(user => user._id.toString()));
//     const availableUsers = all_users.filter(user => !neglectedUserIds.has(user._id.toString()));
//     res.json(availableUsers);
//   }

// })
// app.post('/allrequests', async (req, res) => {
//   try {
//     const { idd } = req.body;
//     const id=idd;
//     const user = await User.findOne({ _id: id });
//     if (!user) {
//       return res.status(404).send({ error: 'User not found' });
//     }
//     const requests = await Request.find({ receiver: user.email });
//     const allUsersPromises = requests.map(async (request) => {
//       let u_email = request.sender;
//       return await User.findOne({ email: u_email });
//     });
//     const all_users = await Promise.all(allUsersPromises);
//     res.status(200).send(all_users.filter(user => user !== null));  // Filter out any null results if some users are not found
//   } catch (error) {
//     res.status(500).send({ error: 'An error occurred' });
//   }
// });
// app.post('/acceptrequest', async (req, res) => {
//   const { sender_id, id } = req.body;
//   const sender = await User.findOne({ _id: sender_id });
//   const receiver = await User.findOne({ _id: id });
//   if (!sender || !receiver) {
//     return res.status(400).json({ message: "Any of the user not exists" });
//   }
//   const deleted_request = await Request.deleteOne({ receiver: sender.email, receiver: receiver.email });

//   const connection = new Connection({
//     sender: sender.email,
//     receiver: receiver.email
//   });

//   connection
//     .save()
//     .then(() => {
//       return res.status(200).json({ message: 'Connected!' });
//     })
//     .catch((err) => {
//       return res.status(500).json({ message: 'Not Connected!' });
//     });
// });
// app.get('/allconnections', (req, res) => {
//   const token = req.cookies.authToken;

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }
//     const user_id = decoded.id;
//     const full_user = await User.findOne({ _id: user_id });
//     let u_email = full_user.email;


//     const connections = await Connection.find({
//       $or: [
//         { receiver: u_email },
//         { sender: u_email }
//       ]
//     });

//     const allUsersConnections = connections.map(async (connection) => {
//       if (u_email == connection.sender)//fetch all the details of receiver user
//       {
//         return await User.findOne({ email: connection.receiver });
//       }
//       else {
//         return await User.findOne({ email: connection.sender });
//       }
//     });
//     const all_users = await Promise.all(allUsersConnections);
//     res.status(200).send(all_users.filter(user => user !== null));

//   });
// });
// app.post('/allnotifications', async (req, res) => {
//   const token = req.cookies.authToken;
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }

//     const user_id = decoded.id;
//     const full_user = await User.findOne({ _id: user_id });
//     const all_notifications = await Notification.find({ youtuber: full_user.email });
//     // Send the response once
//     console.log(all_notifications);
//     res.status(200).send(all_notifications.filter(user => user !== null));
//   });
// });
// const videoMetaStore = {};
// const OAuth2 = google.auth.OAuth2;
// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URIS
// );
// const youtube = google.youtube({
//   version: 'v3',
//   auth: oauth2Client
// });
// app.post('/approve', async (req, res) => {
//   const { editor_email, video_name } = req.body;
//   const token = req.cookies.authToken;
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }
//     const youtuber_id = decoded.id; //--------finding youtuber's id--------------//
//     const video_object = await Video.findOne({ video: video_name });
//     const title = video_object.title;
//     const description = video_object.description;
//     const video_path = video_object.link;
//     //your fuctionality to get video from drive and upload it
//     const store_path = './uploads/' + video_name;
//     saveImageToDisk(video_path, store_path)
//       .then(() => {
//         console.log('File saved successfully, proceeding with YouTube upload');
//         // Now that the file is saved, proceed with YouTube upload and subsequent steps
//         try {
//           const predefinedFileName = video_name;
//           const { title, description } = req.body;
//           const filePath = path.join(__dirname, 'uploads', predefinedFileName);

//           if (fs.existsSync(filePath)) {
//             const fileId = uuid();
//             videoMetaStore[fileId] = { path: filePath, title, description };
//             const authUrl = oauth2Client.generateAuthUrl({
//               access_type: 'offline',
//               scope: 'https://www.googleapis.com/auth/youtube.upload',
//               state: JSON.stringify({ fileId })
//             });
//             res.json({ authUrl });
//           } else {
//             res.status(400).send('File does not exist.');
//           }
//         } catch (err) {
//           console.error('Error handling upload request:', err);
//           res.status(500).send('Error handling upload request.');
//         }
//       })
//       .catch((err) => {
//         console.error('Error saving image:', err);
//         res.status(500).send('Error saving image.');
//       });
//     //   saveImageToDisk(video_path, store_path);
//     //   //line 2
//     //   //lin3
//     //   console.log('going further');

//     //   //---------now the video is uploaded in /uploads
//     //   const OAuth2 = google.auth.OAuth2;
//     //   const oauth2Client = new OAuth2(
//     //     process.env.CLIENT_ID,
//     //     process.env.CLIENT_SECRET,
//     //     process.env.REDIRECT_URIS
//     //   );

//     //   const youtube = google.youtube({
//     //     version: 'v3',
//     //     auth: oauth2Client
//     //   });

//     //   console.log('test1');
//     //  // In-memory storage for video metadata
//     //   const videoMetaStore = {};
//     //   try {
//     //     console.log('test2');
//     //     const predefinedFileName=video_name;
//     //     const { title, description } = req.body;
//     //     const filePath = path.join(__dirname, 'uploads', predefinedFileName);

//     //     if (fs.existsSync(filePath)) {
//     //       console.log('test3');
//     //       const fileId = uuid();
//     //       videoMetaStore[fileId] = { path: filePath, title, description };
//     //       const authUrl = oauth2Client.generateAuthUrl({
//     //         access_type: 'offline',
//     //         scope: 'https://www.googleapis.com/auth/youtube.upload',
//     //         state: JSON.stringify({ fileId })
//     //       });
//     //       res.json({ authUrl });
//     //     } else {
//     //       res.status(400).send('File does not exist.');
//     //     }
//     //   } catch (err) {
//     //     console.error('Error handling upload request:', err);
//     //     res.status(500).send('Error handling upload request.');
//     //   }
//   })
// })
// app.get('/oauth2callback', async (req, res) => {
//   console.log('Test5');
//   try {
//     const { fileId } = JSON.parse(req.query.state);
//     const videoData = videoMetaStore[fileId];

//     if (!videoData) {
//       return res.status(400).send('Invalid file ID.');
//     }

//     const { path, title, description } = videoData;
//     const { tokens } = await oauth2Client.getToken(req.query.code);
//     oauth2Client.setCredentials(tokens);

//     const response = await youtube.videos.insert({
//       resource: {
//         snippet: { title, description },
//         status: { privacyStatus: 'public' }
//       },
//       part: 'snippet,status',
//       media: { body: fs.createReadStream(path) }
//     });

//     // Optionally, cleanup the uploaded file
//     fs.unlinkSync(path);

//     res.send('Video uploaded successfully.');
//   } catch (err) {
//     console.error('Error during OAuth2 callback processing:', err);
//     res.status(500).send('Error during OAuth2 callback processing.');
//   }
// });
// app.post('/deletenotification',async(req,res)=>{
//   const { video_name }=req.body;
//   const deleted_request = await Notification.deleteOne({video: video_name });
//   res.status(200).send('Deleted');

// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});