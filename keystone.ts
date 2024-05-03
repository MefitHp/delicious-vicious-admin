// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";
import "dotenv/config";

const {
  S3_BUCKET_NAME: bucketName,
  S3_REGION: region,
  S3_ACCESS_KEY_ID: accessKeyId,
  S3_SECRET_ACCESS_KEY: secretAccessKey,
} = process.env;

export default withAuth(
  config({
    server: {
      cors: { origin: ["http://localhost:8000"], credentials: true },
    },
    db: {
      provider: "postgresql",
      url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ep-billowing-star-a584btzx.us-east-2.aws.neon.tech/delicious-vicious-dev?sslmode=require`,
    },
    graphql: {
      cors: { origin: ["http://localhost:8000"], credentials: true },
    },
    lists,
    session,
    storage: {
      delicious_vicious_bucket: {
        kind: "s3",
        type: "image",
        bucketName: bucketName ? bucketName : "dev-bucket",
        region: region ? region : "global",
        accessKeyId,
        secretAccessKey,
        // The S3 links will be signed so they remain private
        signed: { expiry: 5000 },
      },
    },
  })
);
