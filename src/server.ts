import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  // / GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async ( req: Request, res: Response) => {
    try {
      let image_url = req.query.image_url;
      console.log(image_url);
      if (!image_url) {
        return res.status(400).send('Image url required!')
      }
      const image = await filterImageFromURL(image_url);
      res.status(200).sendFile(image);
      res.on('finish',()=>deleteLocalFiles([image]));
    } catch (err){
      console.log(err);
    }
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();