// netlify/functions/server.ts
import serverless from "serverless-http";
import { app } from "../../server/src/app"; // استيراد تطبيق Express الرئيسي

// تحويل تطبيق Express إلى دالة سحابية وتصديرها
export const handler = serverless(app );
