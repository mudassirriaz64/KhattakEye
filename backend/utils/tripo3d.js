const { Client, handle_file } = require('@gradio/client');

/**
 * Generates a 3D .glb model from a 2D glasses photo using Hugging Face ZeroGPU TripoSR Space
 * @param {string} imageUrl - Absolute URL or local path to product image
 * @returns {Promise<string>} - Generated .glb URL or file path
 */
async function generate3DModel(imageUrl) {
  try {
    const spaceId = process.env.HF_SPACE_ID || 'stabilityai/TripoSR';
    console.log(`Connecting to Hugging Face Space: ${spaceId}...`);

    const client = await Client.connect(spaceId);

    console.log(`Sending image to TripoSR 3D Generator API...`);
    const result = await client.predict('/predict', {
      input_image: handle_file(imageUrl)
    });

    if (result && result.data && result.data[0]) {
      const glbUrl = result.data[0].url || result.data[0];
      console.log(`Successfully generated 3D model GLB: ${glbUrl}`);
      return glbUrl;
    }

    throw new Error('No 3D model output received from Hugging Face API');
  } catch (error) {
    console.error('Error generating 3D model with TripoSR:', error);
    throw error;
  }
}

module.exports = {
  generate3DModel
};
