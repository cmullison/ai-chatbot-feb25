import OpenAI from 'openai';
import fs from 'node:fs';
const openai = new OpenAI();

(async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'o3-mini',
      messages: [
        {
          role: 'developer',
          content: `You will be provided with sections that a user wants to include in their landing page, as well as a branding guidance using tailwind css variables.

Your goal is to generate a landing page, within a NextJS app, that renders those sections and that uses the color scheme provided. Only use tailwind css classes to define css. Keep the style consistent:
- Use the same type of rounded corners everywhere (if provided in the branding guidance, use the requested variable for rounded corners, if not use rounded-md).
- If provided in the branding guidance, use the requested background color, and a similar background color for alternating sections (for example, gray-100 and white).
- Keep the style sober, with accents using the color scheme provided.
- Include all the sections requested, and make sure the layout is cohesive and works well.

Make sure to include responsive design and basic accessibility features.

Output the final landing page as page.tsx.

Additionally, provide detailed instructions for creating image assets for the landing page. Each image should be described with specific details and a filename:

1. **Hero Section Image**:
   - Description: A vibrant and inviting image of a modern apartment building, showcasing its exterior with lush greenery and a clear blue sky.
   - Filename: "hero-apartment.png"

2. **Grid Section - Verified Listings Icon**:
   - Description: An icon representing verified listings, featuring a checkmark symbol over a stylized apartment building.
   - Filename: "icon-verified.png"

3. **Grid Section - Expert Guidance Icon**:
   - Description: An icon symbolizing expert guidance, with a silhouette of a person holding a magnifying glass over a map.
   - Filename: "icon-expert.png"

4. **Grid Section - Easy Booking Icon**:
   - Description: An icon illustrating easy booking, with a calendar and a clicking hand cursor.
   - Filename: "icon-booking.png"

5. **Picture Section Image**:
   - Description: A cozy and modern apartment interior, highlighting a comfortable living room with stylish furniture and decor.
   - Filename: "interior-apartment.png"

Ensure the images are named according to the instructions and saved in PNG format.`,
        },
        {
          role: 'user',
          content: `{
            "sections": [
              {
                "sectionType": "hero",
                "content": {
                  "headline": "Find Your Perfect Apartment",
                  "subHeadline": "Discover the best apartments in your area with ease.",
                  "backgroundImage": "apartment-hero.jpg",
                  "ctaText": "Get Started",
                  "ctaLink": "/search"
                }
              },
              {
                "sectionType": "grid",
                "content": {
                  "cards": [
                    {
                      "title": "Verified Listings",
                      "description": "All apartments are verified and updated daily.",
                      "icon": "verified.png"
                    },
                    {
                      "title": "Expert Guidance",
                      "description": "Our experts help you choose the best option.",
                      "icon": "expert.png"
                    },
                    {
                      "title": "Easy Booking",
                      "description": "Book a tour with a single click.",
                      "icon": "booking.png"
                    }
                  ]
                }
              },
              {
                "sectionType": "description",
                "content": {
                  "title": "How It Works",
                  "text": "Our platform uses advanced algorithms to match you with the perfect apartment based on your preferences and lifestyle."
                }
              },
              {
                "sectionType": "picture",
                "content": {
                  "image": "apartment-interior.jpg",
                  "caption": "Modern apartment interiors designed for comfort."
                }
              }
            ],
            "branding-guidelines": {
              "corners": "rounded-lg",
              "color-scheme": {
                "background": "gray-50",
                "accent1": "teal-400",
                "accent2": "pink-600"
              }
            }
          }`,
        },
      ],
    });

    console.log('Completion:', completion);

    if (completion.choices && completion.choices.length > 0) {
      const pageContent = completion.choices[0].message.content; // Extract the content
      console.log('Page Content:', pageContent);
      await fs.promises.writeFile('app/apartments/page.tsx', pageContent);
      console.log('Saved page content to app/apartments/page.tsx');
    } else {
      console.error('No choices returned from the API.');
    }

    // Await the response from the first message before generating images
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: `create the image assets for a landing page based on the following description sent to the developer:\n\ncontent: ${completion.choices[0].message.content},\n\nEnsure the images are named according to the developer's response and saved in PNG format.\n\nthe assets you will need to create are:\n[IMAGES/ASSETS FROM RESPONSE TO ABOVE PROMPT]`,
      n: 5, // Specify the number of images/assets
      size: '1024x1024',
      quality: 'high',
    });

    // Convert and save each generated image
    response.data.forEach((image, index) => {
      const imageData = image.b64_json;
      const buffer = Buffer.from(imageData, 'base64');
      const filename = `apartments-${index + 1}.png`; // Use index for sequential numbering
      fs.promises
        .writeFile(filename, buffer)
        .then(() => {
          console.log(`Saved ${filename}`);
        })
        .catch((error) => {
          console.error(`Error saving ${filename}:`, error);
        });
    });
  } catch (error) {
    console.error('Error:', error);
  }
})();
