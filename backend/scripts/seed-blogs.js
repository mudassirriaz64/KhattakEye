const mongoose = require('mongoose');
require('dotenv').config();

const Blog = require('../models/Blog');

const blogArticles = [
  {
    title: "Complete Guide to Choosing the Perfect Eyeglasses Frame",
    slug: "complete-guide-choosing-perfect-eyeglasses-frame",
    excerpt: "Learn how to select eyeglass frames that complement your face shape, skin tone, and personal style. Our comprehensive guide covers everything from frame materials to sizing.",
    content: `<h2>Introduction</h2>
<p>Choosing the right eyeglasses frame can be overwhelming with thousands of options available. This comprehensive guide will help you navigate through the process and find frames that not only correct your vision but also enhance your overall appearance.</p>

<h2>Understanding Face Shapes</h2>
<p>The first step in choosing the perfect frame is identifying your face shape. There are generally six main face shapes: oval, round, square, heart, oblong, and diamond. Each shape has frames that complement it best.</p>

<h3>Oval Face Shape</h3>
<p>Oval faces are considered the most versatile. Most frame shapes work well with oval faces, but avoid frames that are too wide or too narrow compared to your face width.</p>

<h3>Round Face Shape</h3>
<p>For round faces, angular and geometric frames work best. They create contrast and make the face appear more defined. Avoid oversized or round frames that emphasize the roundness.</p>

<h3>Square Face Shape</h3>
<p>Square faces benefit from rounded or oval frames that soften angular features. Look for frames with curved lines rather than sharp edges.</p>

<h2>Frame Materials</h2>
<p>Different materials offer distinct advantages. Plastic frames are durable and come in various colors. Metal frames are lightweight and elegant. Acetate frames offer bold colors and patterns. Choose based on your lifestyle and preferences.</p>

<h2>Color Selection Tips</h2>
<ul>
<li>Fair skin: Silver, gold, tortoiseshell, or pastels</li>
<li>Warm skin: Gold, bronze, warm tortoiseshell</li>
<li>Medium skin: Almost any color works</li>
<li>Deep skin: Gold, bronze, burgundy, or jewel tones</li>
</ul>

<h2>Frame Size Guide</h2>
<p>Frame size is crucial for comfort and appearance. Look for three measurements: lens width, bridge width, and temple length. Your frames should sit comfortably on your nose without sliding down or pinching.</p>

<h2>Conclusion</h2>
<p>Finding the perfect eyeglasses frame is a balance between style, comfort, and functionality. Take your time, try on multiple options, and don't hesitate to ask for professional advice from an optician.</p>`,
    author: "Khattak Eyewear",
    status: "published",
    featured: true,
    tags: ["eyeglasses", "frames", "style", "guide"],
    views: 245,
    publishedAt: new Date("2026-08-10"),
  },
  {
    title: "The Science Behind Blue Light Lenses and Digital Eye Strain",
    slug: "science-behind-blue-light-lenses-digital-eye-strain",
    excerpt: "Discover how blue light from screens affects your eyes and how blue light lenses can help reduce digital eye strain and improve sleep quality.",
    content: `<h2>What is Blue Light?</h2>
<p>Blue light is a high-energy, short-wavelength light that is emitted by the sun and digital devices such as smartphones, tablets, and computer screens. It's a natural part of the light spectrum, but extended exposure from screens can cause discomfort.</p>

<h2>Digital Eye Strain: The Modern Epidemic</h2>
<p>In today's digital age, most of us spend hours staring at screens. This prolonged exposure can lead to digital eye strain, also known as computer vision syndrome. Symptoms include dry eyes, headaches, blurred vision, and neck or shoulder pain.</p>

<h2>How Blue Light Affects Your Eyes</h2>
<p>Blue light has a shorter wavelength than other visible light, making it scatter more easily. This scattered light can reduce contrast and cause glare, leading to eye fatigue. Additionally, blue light suppresses melatonin production, which can affect your sleep-wake cycle.</p>

<h2>Benefits of Blue Light Lenses</h2>
<p>Blue light lenses contain a special coating that filters out or reflects blue light wavelengths. By reducing the amount of blue light reaching your eyes, these lenses can:</p>
<ul>
<li>Reduce eye strain and fatigue</li>
<li>Improve visual clarity and contrast</li>
<li>Help maintain a healthy sleep schedule</li>
<li>Decrease headaches and neck pain</li>
<li>Protect long-term eye health</li>
</ul>

<h2>Who Should Wear Blue Light Lenses?</h2>
<p>Anyone who spends significant time in front of screens can benefit from blue light lenses. This includes office workers, students, gamers, and anyone who uses smartphones frequently.</p>

<h2>Beyond Lenses: Tips to Reduce Digital Eye Strain</h2>
<ul>
<li>Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds</li>
<li>Maintain proper screen distance and lighting</li>
<li>Take regular breaks from screens</li>
<li>Ensure proper monitor positioning</li>
<li>Keep your eyes hydrated with regular blinking</li>
</ul>

<h2>Conclusion</h2>
<p>Blue light lenses are an effective solution for reducing digital eye strain. Combined with healthy screen habits, they can significantly improve your visual comfort and overall eye health in the digital age.</p>`,
    author: "Dr. Sarah Ahmed",
    status: "published",
    featured: true,
    tags: ["blue-light", "eye-health", "digital-screens", "science"],
    views: 189,
    publishedAt: new Date("2026-08-08"),
  },
  {
    title: "Photochromic Lenses: Adapt Your Vision to Every Light",
    slug: "photochromic-lenses-adapt-vision-every-light",
    excerpt: "Explore how photochromic lenses automatically adjust to changing light conditions, providing optimal vision whether you're indoors, outdoors, or driving.",
    content: `<h2>What Are Photochromic Lenses?</h2>
<p>Photochromic lenses, also known as transition lenses, are eyeglass lenses that automatically change color and darkness based on exposure to UV light. They're clear indoors and darken when exposed to sunlight.</p>

<h2>How Do Photochromic Lenses Work?</h2>
<p>Photochromic lenses contain special molecules called photochromic compounds that undergo a chemical change when exposed to ultraviolet (UV) light. This chemical reaction causes the lens to darken. When you move indoors or away from direct sunlight, the lenses gradually fade back to their clear state.</p>

<h2>Types of Photochromic Lenses</h2>
<h3>Traditional Photochromic Lenses</h3>
<p>These lenses contain halide or silver halide compounds. They're reliable and widely available, though they may not darken as quickly in extreme heat.</p>

<h3>Naphthopyran-based Lenses</h3>
<p>These newer lenses darken faster and fade back to clear more quickly than traditional options. They also offer better clarity indoors.</p>

<h2>Advantages of Photochromic Lenses</h2>
<ul>
<li>Convenience: No need to carry separate sunglasses</li>
<li>Cost-effective: One pair of glasses for multiple purposes</li>
<li>UV Protection: Automatically provide sun protection</li>
<li>Reduced Glare: Help reduce glare from bright sunlight</li>
<li>Improved Comfort: Gradual transitions are easier on the eyes</li>
</ul>

<h2>Perfect for Different Lifestyles</h2>
<p>Whether you're an outdoor enthusiast, office worker, or someone who moves between environments frequently, photochromic lenses offer the perfect solution. They're ideal for:</p>
<ul>
<li>Driving (though not in vehicles with UV-blocking windshields)</li>
<li>Outdoor activities like hiking and sports</li>
<li>Commuting between home and office</li>
<li>Travel and tourism</li>
</ul>

<h2>Important Considerations</h2>
<p>While photochromic lenses are highly effective, they do take a few seconds to transition between states. In extreme heat, they may not darken as much as in cooler conditions. Some car windshields block UV light, which can limit the darkening response.</p>

<h2>Conclusion</h2>
<p>Photochromic lenses represent a smart, convenient solution for people who spend time both indoors and outdoors. They provide seamless adaptation to changing lighting conditions while protecting your eyes from harmful UV rays.</p>`,
    author: "Khattak Eyewear",
    status: "published",
    featured: false,
    tags: ["photochromic", "transitions", "lenses", "UV-protection"],
    views: 167,
    publishedAt: new Date("2026-08-05"),
  },
  {
    title: "Eye Care Tips: 5 Habits for Healthy Vision",
    slug: "eye-care-tips-5-habits-healthy-vision",
    excerpt: "Maintain optimal eye health with these five essential habits. From proper nutrition to regular eye exams, learn what you can do to protect your vision.",
    content: `<h2>Introduction</h2>
<p>Your eyes are one of your most precious senses. Taking care of them should be a priority. In this article, we share five essential habits that can help you maintain healthy vision for years to come.</p>

<h2>1. Get Regular Eye Exams</h2>
<p>Even if you don't wear glasses or contact lenses, regular eye exams are crucial. An eye care professional can detect early signs of eye diseases like glaucoma, cataracts, and macular degeneration. Most experts recommend an eye exam every one to two years.</p>

<h2>2. Eat Eye-Healthy Foods</h2>
<p>Nutrition plays a vital role in eye health. Include these foods in your diet:</p>
<ul>
<li>Leafy greens (spinach, kale) - rich in lutein and zeaxanthin</li>
<li>Carrots and sweet potatoes - high in beta-carotene</li>
<li>Fatty fish (salmon, tuna) - contain omega-3 fatty acids</li>
<li>Eggs - good source of antioxidants</li>
<li>Citrus fruits - packed with vitamin C</li>
<li>Nuts and seeds - contain vitamin E</li>
</ul>

<h2>3. Protect Your Eyes from UV Radiation</h2>
<p>UV rays can damage your eyes just like they damage your skin. Always wear sunglasses that block 100% of UVA and UVB rays when outdoors, even on cloudy days. Additionally, wear protective eyewear when doing activities like woodworking or yard work.</p>

<h2>4. Practice the 20-20-20 Rule</h2>
<p>If you spend long hours in front of a screen, follow this simple rule: Every 20 minutes, take a 20-second break and look at something 20 feet away. This helps reduce eye strain and fatigue.</p>

<h2>5. Don't Smoke and Limit Alcohol</h2>
<p>Smoking increases the risk of eye diseases including cataracts and macular degeneration. If you smoke, quitting is one of the best things you can do for your eye health. Excessive alcohol consumption can also negatively impact vision.</p>

<h2>Additional Tips</h2>
<ul>
<li>Stay hydrated - drink plenty of water</li>
<li>Get enough sleep - your eyes need rest</li>
<li>Maintain a healthy weight</li>
<li>Control blood pressure and diabetes</li>
<li>Wash hands before handling contact lenses</li>
</ul>

<h2>Conclusion</h2>
<p>By incorporating these habits into your daily routine, you can significantly improve and maintain your eye health. Remember, prevention is always better than treatment when it comes to your vision.</p>`,
    author: "Dr. Hassan Khan",
    status: "published",
    featured: false,
    tags: ["eye-care", "health", "tips", "wellness"],
    views: 312,
    publishedAt: new Date("2026-08-03"),
  },
  {
    title: "Fashion Forward: How to Style Your Eyeglasses",
    slug: "fashion-forward-how-to-style-eyeglasses",
    excerpt: "Eyeglasses are more than just a vision correction tool—they're a fashion statement. Learn how to style your glasses to match your personal aesthetic and outfit.",
    content: `<h2>Eyeglasses as Fashion Accessories</h2>
<p>Gone are the days when eyeglasses were considered just a necessity. Today, they're a crucial fashion accessory that can completely transform your look. Whether you prefer a classic, minimalist, or bold style, there's a frame out there for you.</p>

<h2>Matching Your Glasses to Your Personal Style</h2>
<h3>Classic and Professional</h3>
<p>If your style is timeless and professional, opt for classic frame shapes like rectangular or oval in neutral colors like black, brown, or tortoiseshell. These work well in corporate settings and with most outfits.</p>

<h3>Trendy and Modern</h3>
<p>For those who love staying on top of trends, oversized frames, colored lenses, or geometric shapes are perfect. Don't be afraid to experiment with bold colors that match current fashion trends.</p>

<h3>Bohemian and Artistic</h3>
<p>If you have a free-spirited aesthetic, vintage-inspired frames, unique shapes, or earth-tone colors would suit you. Mix and match with eclectic outfits for maximum impact.</p>

<h2>Coordinating Frames with Outfits</h2>
<ul>
<li>Casual: Go for relaxed frames in fun colors or patterns</li>
<li>Business: Stick with classic, understated frames</li>
<li>Evening: Try statement pieces or designer frames</li>
<li>Sporty: Choose lightweight, sporty-styled frames</li>
</ul>

<h2>Color Psychology and Frame Selection</h2>
<p>The color of your frames can influence the impression you make:</p>
<ul>
<li>Black: Timeless, professional, sophisticated</li>
<li>Brown: Warm, approachable, classic</li>
<li>Red: Bold, confident, attention-grabbing</li>
<li>Blue: Cool, calm, trustworthy</li>
<li>Tortoiseshell: Trendy, versatile, unique</li>
</ul>

<h2>Having Multiple Pairs</h2>
<p>Just like having multiple pairs of shoes, having several pairs of eyeglasses allows you to match your look to different occasions and outfits. Consider investing in one pair for everyday wear and another for special occasions.</p>

<h2>Maintenance for Style Longevity</h2>
<p>Keep your glasses looking great by:</p>
<ul>
<li>Cleaning them daily with proper lens cleaner</li>
<li>Storing them in a protective case</li>
<li>Having them adjusted regularly for proper fit</li>
<li>Protecting them from extreme temperatures</li>
</ul>

<h2>Conclusion</h2>
<p>Your eyeglasses are an extension of your personality and style. By choosing frames that complement your face shape, skin tone, and personal aesthetic, you can enhance your appearance while improving your vision. Remember, the perfect frame is the one that makes you feel confident!</p>`,
    author: "Fashion Editor - Khattak Eyewear",
    status: "published",
    featured: false,
    tags: ["fashion", "style", "eyeglasses", "accessories"],
    views: 198,
    publishedAt: new Date("2026-08-01"),
  },
];

async function seedBlogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/khattakeye');
    console.log('MongoDB connected');

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('Cleared existing blogs');

    // Insert new blogs
    const result = await Blog.insertMany(blogArticles);
    console.log(`✓ Successfully seeded ${result.length} blog articles`);

    // Display summary
    result.forEach((blog) => {
      console.log(`  • "${blog.title}" (${blog.status})`);
    });

    await mongoose.disconnect();
    console.log('\nSeeding complete!');
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
}

seedBlogs();
