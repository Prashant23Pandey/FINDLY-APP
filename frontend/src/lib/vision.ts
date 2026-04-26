import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

/**
 * Analyzes an image using the MobileNet model.
 * @param imageSrc Base64 or URL of the image
 * @returns Array of predictions with labels and confidence scores
 */
export async function analyzeImage(imageSrc: string): Promise<{ label: string, confidence: number }[]> {
  try {
    if (!model) {
      await tf.ready();
      model = await mobilenet.load({ version: 2, alpha: 1.0 });
    }

    // Create an HTMLImageElement to load the image
    const img = new Image();
    img.src = imageSrc;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const predictions = await model.classify(img);
    
    return predictions.map(p => ({
      label: p.className.split(',')[0], // Take the first name in the series
      confidence: Math.round(p.probability * 100)
    }));
  } catch (error) {
    console.error('Vision analysis failed:', error);
    return [];
  }
}
