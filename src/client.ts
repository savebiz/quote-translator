import { createThirdwebClient } from "thirdweb";

// Get client ID from environment variable
// For production: Set VITE_TEMPLATE_CLIENT_ID in Vercel environment variables
const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

if (!clientId) {
	console.warn(
		"Warning: VITE_TEMPLATE_CLIENT_ID is not set. " +
		"Please set it in your environment variables for production deployment."
	);
}

export const client = createThirdwebClient({
	clientId: clientId || "46b570c963786a0cb658b41187d653d3",
});
