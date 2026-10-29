# Image sources

Every image on the site is registered in `src/content/images.ts` with its alt text.

## Brand (supplied by the client)

| File                                                                       | Source                                                                                                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `assets/brand/hamze-brothers-logo-original.jpg`                            | Original circular logo supplied for the project (master copy, not served).                                              |
| `public/brand/hamze-brothers-logo-full.png`                                | Full bilingual logo cut from the original with its background made transparent. Proportions unchanged.                  |
| `public/brand/hamze-brothers-mark.png`                                     | Fruit mark only (top portion of the same logo), used in the header beside the text name. Use on light backgrounds only. |
| `public/brand/hamze-brothers-badge-512.png`                                | The original circular logo, masked to a circle.                                                                         |
| `src/app/icon.png`, `apple-icon.png`, `favicon.ico`, `public/og-image.jpg` | Generated from the logo files above (OG image also uses the blood-orange store photo).                                  |

## Store photography (Hamze Brothers' own Instagram)

Cropped to remove overlaid dates, prices and captions so no historical offer is shown.

| File                                           | Source                                                                      |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `public/images/store/blood-orange-squeeze.jpg` | Instagram story "Weekend specials – Part 1" (11/09/2026), top section only. |
| `public/images/store/in-store-display.jpg`     | Instagram story "Weekend specials – Part 2" (12/09/2026), top section only. |

The Google Maps listing supplied (PDF) shows good interior photos, but most are uploaded by customers, so they were **not** used. Ask the owners for original photos and short clips of the store (see README).

## Stock photography (Unsplash License)

Free to use commercially under the [Unsplash License](https://unsplash.com/license). Used to illustrate produce types and the demo catalogue; they are not photos of the shop. Downloaded from the Unsplash CDN and re-encoded to max 1400 px.

| File                      | Unsplash photo ID                |
| ------------------------- | -------------------------------- |
| apples.jpg                | photo-1560806887-1e4cd0b6cbd6    |
| avocado.jpg               | photo-1519162808019-7de1683fa2ad |
| bananas.jpg               | photo-1603833665858-e61d17a86224 |
| blueberries.jpg           | photo-1498557850523-fd3d118b962e |
| broccoli.jpg              | photo-1584270354949-c26b0d5b4a0c |
| brown-onions.jpg          | photo-1580201092675-a0a6a6cafbb1 |
| carrots.jpg               | photo-1598170845058-32b9d6a5da37 |
| cherries.jpg              | photo-1559181567-c3190ca9959b    |
| eggs.jpg                  | photo-1582722872445-44dc5f7e3c8f |
| fruit-assortment.jpg      | photo-1610832958506-aa56368176cf |
| grapes.jpg                | photo-1596363505729-4190a9506133 |
| green-apples.jpg          | photo-1590005354167-6da97870c757 |
| kiwifruit.jpg             | photo-1585059895524-72359e06133a |
| lemons.jpg                | photo-1590502593747-42a996133562 |
| lettuce.jpg               | photo-1622206151226-18ca2c9ab4a1 |
| mandarin.jpg              | photo-1557800636-894a64c1696f    |
| mango.jpg                 | photo-1553279768-865429fa0078    |
| orange-juice-bottle.jpg   | photo-1621506289937-a8e4df240d0b |
| orange-juice-glass.jpg    | photo-1613478223719-2ab802602423 |
| oranges.jpg               | photo-1547514701-42782101795e    |
| pineapple.jpg             | photo-1550258987-190a2d41a8ba    |
| pomegranates.jpg          | photo-1541344999736-83eca272f6fc |
| potatoes.jpg              | photo-1518977676601-b53f82aba655 |
| red-onions.jpg            | photo-1618512496248-a07fe83aa8cb |
| rosemary.jpg              | photo-1515586000433-45406d8e6662 |
| spices.jpg                | photo-1596040033229-a9821ebd058d |
| spinach.jpg               | photo-1576045057995-568f588f82fb |
| strawberries.jpg          | photo-1464965911861-746a04b4bca6 |
| tomatoes.jpg              | photo-1592924357228-91a4daadcfea |
| vegetables-assortment.jpg | photo-1597362925123-77861d3fbac7 |
| watermelon.jpg            | photo-1587049352846-4a222e784d38 |

Original URL pattern: `https://images.unsplash.com/<photo ID>`. Photographer credit is not required by the licence but can be added from each photo's Unsplash page.

## Illustrative hero image

| File                                            | Source                                                                                                                                               |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/images/produce/hero-fruit-platter.jpeg` | AI-generated fruit platter supplied by the project owner, who confirmed on 25 Oct 2026 that they hold a licence for its use (licence document not kept in this repository); illustrative, not a shop photo. |

## Not used

- The supplied "Fresh produce made easy" mockup contains AI-generated people and shop scenes, so it was used for layout direction only.
- The "Saturday Special" juice flyer advertises a past offer, so it is not shown.

## October 2026 homepage reference

`design-reference/reference-homepage.png` is the supplied visual specification. The supplied Google Maps PDF was inspected and individual photographs extracted to `outputs/pdf-extracted/` for private reference only. Its main interior panorama is attributed to Edison Liang and carries a copyright notice; no license for republication was supplied. These PDF images are not served by the site. Store entrance imagery remains pending an owner-supplied or licensed original.

The homepage hero and story use the existing business-owned `in-store-display` photograph, optimized without distortion to `public/images/hamze/in-store-display.webp`. The existing owned blood-orange photograph is also optimized to WebP. Category images retain the licensed, illustrative produce photography registered above. The mockup address/hours were not adopted; verified business configuration remains authoritative.
