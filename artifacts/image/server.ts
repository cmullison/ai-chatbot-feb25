import { myProvider } from '@/lib/ai/providers';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { experimental_generateImage } from 'ai';

export const imageDocumentHandler = createDocumentHandler<'image'>({
  kind: 'image',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    try {
      const { image } = await experimental_generateImage({
        model: myProvider.imageModel('small-model'),
        prompt: title,
        providerOptions: {
          replicate: {
            go_fast: false,
            megapixels: "1",
            num_outputs: 4,
            aspect_ratio: "16:9",
            output_format: "webp",
            output_quality: 80,
            num_inference_steps: 4,
            guidance_scale: 7.5,
            negative_prompt: "",
            disable_safety_checker: true,
          }
        }
      });

      draftContent = image.base64;

      dataStream.writeData({
        type: 'image-delta',
        content: image.base64,
      });
    } catch (error) {
      console.error('Error generating image in onCreateDocument:', error);
      dataStream.writeData({ type: 'error', error: error instanceof Error ? error.message : 'Unknown image generation error' });
      throw error;
    }

    return draftContent;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    let draftContent = '';

    try {
      const { image } = await experimental_generateImage({
        model: myProvider.imageModel('small-model'),
        prompt: description,
        n: 1,
      });

      draftContent = image.base64;

      dataStream.writeData({
        type: 'image-delta',
        content: image.base64,
      });
    } catch (error) {
      console.error('Error generating image in onUpdateDocument:', error);
      dataStream.writeData({ type: 'error', error: error instanceof Error ? error.message : 'Unknown image generation error' });
      throw error;
    }

    return draftContent;
  },
});
