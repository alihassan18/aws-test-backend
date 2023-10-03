import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import * as sharp from 'sharp';
import * as streamifier from 'streamifier';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { formatCount } from './numbers';

// function roundedImage(ctx, x, y, width, height, radius) {
//     ctx.beginPath();
//     ctx.moveTo(x + radius, y);
//     ctx.lineTo(x + width - radius, y);
//     ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//     ctx.lineTo(x + width, y + height - radius);
//     ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//     ctx.lineTo(x + radius, y + height);
//     ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//     ctx.lineTo(x, y + radius);
//     ctx.quadraticCurveTo(x, y, x + radius, y);
//     ctx.closePath();
// }

// function generateStats(canvas, name, value, xPos, yPos) {
//     /* Collection items context */
//     const ictx = canvas.getContext('2d');
//     ictx.font = 'bold 20px Arial';
//     ictx.fillStyle = '#fff';
//     ictx.fillText(value, xPos, yPos + 60);

//     const inctx = canvas.getContext('2d');
//     inctx.font = 'bold 15px Arial';
//     inctx.fillStyle = '#fff';
//     inctx.fillText(name, xPos, yPos + 80);
//     /* Collection items context end */
// }

async function uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        cloudinary.config({
            cloud_name: 'dq3jqnrem',
            api_key: '489381544782379',
            api_secret: 'Q__CwDCL3WG1avdqpd_YJX4_sOU'
        });
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'events',
                upload_preset: 'ml_default'
            },
            (error: Error, result: UploadApiResponse) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

function truncateText(context, text, maxWidth) {
    let truncatedText = text;
    while (context.measureText(truncatedText).width > maxWidth) {
        truncatedText = truncatedText.slice(0, -1);
    }
    if (truncatedText !== text) {
        truncatedText += '...';
    }
    return truncatedText;
}

export const generateOGImage = async (
    type,
    name,
    banner,
    description,
    symbol,
    rowValue1,
    rowValue2: number,
    rowValue3,
    rowValue4,
    rowValue5,
    rowValue6
): Promise<string> => {
    try {
        /* Main canvas */
        const width = 500;
        const height = 400;

        // Create a canvas
        const canvas = createCanvas(width, height);
        const mainContext = canvas.getContext('2d');

        mainContext.fillStyle = 'orange';
        mainContext.fillRect(20, 20, canvas.width, canvas.height);

        const imageResponse = await axios.get(banner, {
            responseType: 'arraybuffer'
        });
        const img = await sharp(imageResponse.data)
            .resize(canvas.width + 200, canvas.height)
            .toFormat('png')
            .toBuffer();
        const bg = await loadImage(img);
        /* END */

        /* cover */
        const coverctx = canvas.getContext('2d');
        coverctx.fillStyle = 'yellow';
        coverctx.fillRect(20, 20, canvas.width, canvas.height - 140);
        coverctx.imageSmoothingEnabled = false;
        coverctx.drawImage(bg, 0, 20, canvas.width, canvas.height - 140);

        /* Rounded image */
        const ictx = canvas.getContext('2d');
        ictx.fillStyle = 'yellow';

        const mintstargramImgRes = await axios.get(
            'https://res.cloudinary.com/dq3jqnrem/image/upload/v1692279602/ejcwujareqp8zmn0ibo5.png',
            {
                responseType: 'arraybuffer'
            }
        );
        const mintstargramImg = await sharp(mintstargramImgRes.data)
            .toFormat('png')
            .toBuffer();
        const mintstargramLogo = await loadImage(mintstargramImg);
        ictx.drawImage(mintstargramLogo, 430, 160, 70, 70);

        /* END */

        const nctx = canvas.getContext('2d');
        nctx.fillStyle = '#000';
        nctx.fillRect(-0, height - 180, width, 80);
        // nctx.drawImage(bg, 0, 0);

        nctx.textAlign = 'center';

        nctx.font = 'bold 14px Arial';
        nctx.fillStyle = '#FFFFFF';
        nctx.fillText(
            `${
                type === 'nft'
                    ? `#${rowValue1}`
                    : Number(
                          Number(formatCount(rowValue1)).toFixed(2)
                      ).toLocaleString()
            }
           `,
            50,
            260
        );
        nctx.font = '12px Arial';
        nctx.fillStyle = '#5C5C63';
        nctx.fillText(
            type === 'collection'
                ? 'Floor Price'
                : type === 'nft'
                ? 'Token ID'
                : 'Followers',
            50,
            280
        );

        // nctx.fillStyle = 'white';
        nctx.fillRect(100, 240, 2, 50);

        nctx.font = 'bold 14px Arial';
        nctx.fillStyle = '#FFFFFF';
        nctx.fillText(formatCount(rowValue2) + ' ' + symbol, 150, 260);
        nctx.font = '12px Arial';
        nctx.fillStyle = '#5C5C63';
        nctx.fillText(
            type === 'collection'
                ? 'Volume'
                : type === 'nft'
                ? 'Price'
                : 'Following',
            150,
            280
        );

        // nctx.fillStyle = 'white';
        nctx.fillRect(200, 240, 2, 50);

        nctx.font = 'bold 14px Arial';
        nctx.fillStyle = '#FFFFFF';
        nctx.fillText(formatCount(rowValue3), 250, 260);
        nctx.font = '12px Arial';
        nctx.fillStyle = '#5C5C63';
        nctx.fillText(
            type === 'collection' || type === 'nft' ? 'Comments' : 'Minted',
            250,
            280
        );

        // nctx.fillStyle = 'white';
        nctx.fillRect(300, 240, 2, 50);

        nctx.font = 'bold 14px Arial';
        nctx.fillStyle = '#FFFFFF';
        nctx.fillText(formatCount(rowValue4), 350, 260);
        nctx.font = '12px Arial';
        nctx.fillStyle = '#5C5C63';
        nctx.fillText(
            type === 'collection' || type === 'nft' ? 'Reposts' : 'Listed',
            350,
            280
        );

        // nctx.fillStyle = 'white';
        nctx.fillRect(400, 240, 2, 50);

        nctx.font = 'bold 14px Arial';
        nctx.fillStyle = '#FFFFFF';
        nctx.fillText(formatCount(rowValue5), 450, 260);
        nctx.font = '12px Arial';
        nctx.fillStyle = '#5C5C63';
        nctx.fillText(
            type === 'collection' || type === 'nft' ? 'Likes' : 'Bought',
            450,
            280
        );

        // nctx.fillStyle = 'white';
        nctx.fillRect(500, 240, 2, 50);

        nctx.font = 'bold 14px Arial';
        nctx.fillStyle = '#FFFFFF';
        nctx.fillText(formatCount(rowValue6), 550, 260);
        nctx.font = '12px Arial';
        nctx.fillStyle = '#5C5C63';
        nctx.fillText(
            type === 'collection' || type === 'nft' ? 'Views' : 'Sold',
            550,
            280
        );

        /* Bottom */
        const bctx = canvas.getContext('2d');
        bctx.fillStyle = '#2B2B35';
        bctx.fillRect(0, height - 100, width, 100);

        bctx.textAlign = 'left';
        bctx.font = '15px Arial';

        const maxLengthFirstPart = 60;

        // Divide the description into two parts
        const firstPart = description
            .replace(/\s+/g, ' ')
            .substring(0, maxLengthFirstPart);
        const secondPart = description
            .replace(/\s+/g, ' ')
            .substring(maxLengthFirstPart);
        const secondLine =
            type === 'collection'
                ? `${name} Collection Mintstargram NFT Marketplace`
                : `${name} | Mintstargram`;

        bctx.fillStyle = '#727279';
        bctx.fillText('Mintstargram.COM', 20, 325);
        bctx.fillStyle = 'white';
        bctx.fillText(truncateText(bctx, secondLine, width - 100), 20, 345);
        bctx.fillStyle = '#727279';
        bctx.fillText(firstPart, 20, 365);
        bctx.fillText(truncateText(bctx, secondPart, width - 100), 20, 385);

        const buffer = canvas.toBuffer('image/png');
        // const str = canvas.toDataURL('image/png');
        const res = await uploadImage(buffer);
        return res.url;
        // return str;
    } catch (error) {
        console.log(error);
        return null;
    }
};
