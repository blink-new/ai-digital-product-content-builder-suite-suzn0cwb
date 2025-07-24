import { ProductType } from '../types'

export const productTypes: ProductType[] = [
  {
    id: 'ebook',
    name: 'Ebook',
    category: 'Publishing',
    description: 'Comprehensive digital book with chapters and sections',
    icon: 'Book',
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true, placeholder: 'Enter your ebook title' },
      { id: 'subtitle', name: 'Subtitle', type: 'text', required: false, placeholder: 'Optional subtitle' },
      { id: 'author', name: 'Author', type: 'text', required: true, placeholder: 'Author name' },
      { id: 'description', name: 'Description', type: 'textarea', required: true, placeholder: 'Brief description of your ebook' },
      { id: 'chapters', name: 'Number of Chapters', type: 'number', required: true, placeholder: '5' },
      { id: 'tone', name: 'Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Academic', 'Conversational'] }
    ]
  },
  {
    id: 'checklist',
    name: 'Checklist',
    category: 'Productivity',
    description: 'Step-by-step actionable checklist',
    icon: 'CheckSquare',
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true, placeholder: 'Enter checklist title' },
      { id: 'description', name: 'Description', type: 'textarea', required: true, placeholder: 'What does this checklist help with?' },
      { id: 'items', name: 'Number of Items', type: 'number', required: true, placeholder: '10' },
      { id: 'category', name: 'Category', type: 'select', required: true, options: ['Business', 'Personal', 'Health', 'Finance', 'Travel'] }
    ]
  },
  {
    id: 'workbook',
    name: 'Workbook',
    category: 'Education',
    description: 'Interactive workbook with exercises and activities',
    icon: 'FileText',
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true, placeholder: 'Enter workbook title' },
      { id: 'description', name: 'Description', type: 'textarea', required: true, placeholder: 'What will users learn?' },
      { id: 'exercises', name: 'Number of Exercises', type: 'number', required: true, placeholder: '8' },
      { id: 'difficulty', name: 'Difficulty Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] }
    ]
  },
  {
    id: 'planner',
    name: 'Planner',
    category: 'Organization',
    description: 'Structured planning template for goals and tasks',
    icon: 'Calendar',
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true, placeholder: 'Enter planner title' },
      { id: 'timeframe', name: 'Time Frame', type: 'select', required: true, options: ['Daily', 'Weekly', 'Monthly', 'Yearly'] },
      { id: 'focus', name: 'Focus Area', type: 'select', required: true, options: ['Business', 'Personal', 'Health', 'Finance', 'Goals'] },
      { id: 'sections', name: 'Number of Sections', type: 'number', required: true, placeholder: '6' }
    ]
  },
  {
    id: 'journal',
    name: 'Journal',
    category: 'Personal Development',
    description: 'Guided journal with prompts and reflections',
    icon: 'BookOpen',
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true, placeholder: 'Enter journal title' },
      { id: 'theme', name: 'Theme', type: 'select', required: true, options: ['Gratitude', 'Self-Reflection', 'Goal Setting', 'Mindfulness', 'Creativity'] },
      { id: 'prompts', name: 'Number of Prompts', type: 'number', required: true, placeholder: '30' },
      { id: 'duration', name: 'Duration', type: 'select', required: true, options: ['7 Days', '30 Days', '90 Days', '365 Days'] }
    ]
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    category: 'Content',
    description: 'SEO-optimized blog post with engaging content',
    icon: 'Edit3',
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true, placeholder: 'Enter blog post title' },
      { id: 'topic', name: 'Topic/Niche', type: 'text', required: true, placeholder: 'What is this post about?' },
      { id: 'keywords', name: 'Target Keywords', type: 'text', required: false, placeholder: 'SEO keywords (comma separated)' },
      { id: 'tone', name: 'Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Humorous', 'Authoritative', 'Conversational'] },
      { id: 'length', name: 'Length', type: 'select', required: true, options: ['Short (500-800 words)', 'Medium (800-1500 words)', 'Long (1500+ words)'] }
    ]
  },
  {
    id: 'social-media-pack',
    name: 'Social Media Content Pack',
    category: 'Marketing',
    description: 'Complete social media content package',
    icon: 'Share2',
    fields: [
      { id: 'platform', name: 'Platform', type: 'select', required: true, options: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'All Platforms'] },
      { id: 'niche', name: 'Niche/Industry', type: 'text', required: true, placeholder: 'What industry or niche?' },
      { id: 'posts', name: 'Number of Posts', type: 'number', required: true, placeholder: '20' },
      { id: 'style', name: 'Content Style', type: 'select', required: true, options: ['Educational', 'Inspirational', 'Promotional', 'Entertainment', 'Mixed'] }
    ]
  },
  {
    id: 'email-sequence',
    name: 'Email Sequence',
    category: 'Marketing',
    description: 'Automated email marketing sequence',
    icon: 'Mail',
    fields: [
      { id: 'purpose', name: 'Purpose', type: 'select', required: true, options: ['Welcome Series', 'Product Launch', 'Nurture Sequence', 'Sales Funnel', 'Re-engagement'] },
      { id: 'emails', name: 'Number of Emails', type: 'number', required: true, placeholder: '7' },
      { id: 'audience', name: 'Target Audience', type: 'text', required: true, placeholder: 'Describe your audience' },
      { id: 'goal', name: 'Main Goal', type: 'text', required: true, placeholder: 'What action do you want them to take?' }
    ]
  },
  {
    id: 'course-outline',
    name: 'Course Outline',
    category: 'Education',
    description: 'Structured course curriculum and lesson plan',
    icon: 'GraduationCap',
    fields: [
      { id: 'title', name: 'Course Title', type: 'text', required: true, placeholder: 'Enter course title' },
      { id: 'subject', name: 'Subject/Topic', type: 'text', required: true, placeholder: 'What will you teach?' },
      { id: 'modules', name: 'Number of Modules', type: 'number', required: true, placeholder: '8' },
      { id: 'level', name: 'Skill Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
      { id: 'duration', name: 'Course Duration', type: 'select', required: true, options: ['1-2 hours', '3-5 hours', '6-10 hours', '10+ hours'] }
    ]
  },
  {
    id: 'business-plan',
    name: 'Business Plan',
    category: 'Business',
    description: 'Comprehensive business plan template',
    icon: 'Briefcase',
    fields: [
      { id: 'businessName', name: 'Business Name', type: 'text', required: true, placeholder: 'Enter business name' },
      { id: 'industry', name: 'Industry', type: 'text', required: true, placeholder: 'What industry?' },
      { id: 'businessType', name: 'Business Type', type: 'select', required: true, options: ['Startup', 'Small Business', 'E-commerce', 'Service Business', 'Product Business'] },
      { id: 'sections', name: 'Plan Sections', type: 'select', required: true, options: ['Executive Summary Only', 'Standard Plan', 'Comprehensive Plan', 'Investor-Ready Plan'] }
    ]
  }
]

// Add more product types to reach 60 total
export const additionalProductTypes: ProductType[] = [
  {
    id: 'resume-template',
    name: 'Resume Template',
    category: 'Career',
    description: 'Professional resume template',
    icon: 'User',
    fields: [
      { id: 'industry', name: 'Industry', type: 'text', required: true, placeholder: 'Target industry' },
      { id: 'level', name: 'Career Level', type: 'select', required: true, options: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'] },
      { id: 'style', name: 'Style', type: 'select', required: true, options: ['Modern', 'Classic', 'Creative', 'Minimalist'] }
    ]
  },
  {
    id: 'meal-planner',
    name: 'Meal Planner',
    category: 'Health',
    description: 'Weekly meal planning template',
    icon: 'Utensils',
    fields: [
      { id: 'dietType', name: 'Diet Type', type: 'select', required: true, options: ['General', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean'] },
      { id: 'duration', name: 'Planning Duration', type: 'select', required: true, options: ['1 Week', '2 Weeks', '1 Month'] },
      { id: 'meals', name: 'Meals per Day', type: 'select', required: true, options: ['3 Meals', '3 Meals + Snacks', '5 Small Meals'] }
    ]
  },
  {
    id: 'budget-planner',
    name: 'Budget Planner',
    category: 'Finance',
    description: 'Personal or business budget template',
    icon: 'DollarSign',
    fields: [
      { id: 'type', name: 'Budget Type', type: 'select', required: true, options: ['Personal', 'Family', 'Business', 'Event'] },
      { id: 'timeframe', name: 'Time Frame', type: 'select', required: true, options: ['Monthly', 'Quarterly', 'Yearly'] },
      { id: 'categories', name: 'Budget Categories', type: 'number', required: true, placeholder: '10' }
    ]
  },
  {
    id: 'wedding-planner',
    name: 'Wedding Planner',
    category: 'Events',
    description: 'Complete wedding planning checklist and timeline',
    icon: 'Heart',
    fields: [
      { id: 'timeline', name: 'Planning Timeline', type: 'select', required: true, options: ['6 Months', '12 Months', '18 Months', '24 Months'] },
      { id: 'style', name: 'Wedding Style', type: 'select', required: true, options: ['Traditional', 'Modern', 'Rustic', 'Beach', 'Destination'] },
      { id: 'guestCount', name: 'Estimated Guests', type: 'select', required: true, options: ['Under 50', '50-100', '100-200', '200+'] }
    ]
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    category: 'Health',
    description: 'Workout and fitness progress tracker',
    icon: 'Activity',
    fields: [
      { id: 'goal', name: 'Fitness Goal', type: 'select', required: true, options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness', 'Strength'] },
      { id: 'level', name: 'Fitness Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
      { id: 'duration', name: 'Program Duration', type: 'select', required: true, options: ['4 Weeks', '8 Weeks', '12 Weeks', '6 Months'] }
    ]
  }
]

// New Creative & Content Products
export const creativeContentProducts: ProductType[] = [
  {
    id: 'podcast-episode-pack',
    name: 'Podcast Episode Pack',
    category: 'Creative & Content',
    description: 'Audio scripts, title options, show notes, timestamps',
    icon: 'Mic',
    fields: [
      { id: 'topic', name: 'Episode Topic', type: 'text', required: true, placeholder: 'What is the episode about?' },
      { id: 'duration', name: 'Target Duration', type: 'select', required: true, options: ['15-20 minutes', '20-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes'] },
      { id: 'format', name: 'Episode Format', type: 'select', required: true, options: ['Solo', 'Interview', 'Panel Discussion', 'Storytelling', 'Educational'] },
      { id: 'audience', name: 'Target Audience', type: 'text', required: true, placeholder: 'Describe your listeners' }
    ]
  },
  {
    id: 'youtube-video-kit',
    name: 'YouTube Video Kit',
    category: 'Creative & Content',
    description: 'Title, thumbnail prompt, description, script, tags, chapters',
    icon: 'Video',
    fields: [
      { id: 'niche', name: 'Video Niche', type: 'text', required: true, placeholder: 'What niche/topic?' },
      { id: 'videoType', name: 'Video Type', type: 'select', required: true, options: ['Tutorial', 'Review', 'Vlog', 'Educational', 'Entertainment', 'How-to'] },
      { id: 'duration', name: 'Target Duration', type: 'select', required: true, options: ['Under 5 minutes', '5-10 minutes', '10-20 minutes', '20+ minutes'] },
      { id: 'style', name: 'Content Style', type: 'select', required: true, options: ['Casual', 'Professional', 'Energetic', 'Calm', 'Humorous'] }
    ]
  },
  {
    id: 'childrens-story-pack',
    name: 'Children\'s Story Pack',
    category: 'Creative & Content',
    description: 'Illustrated PDF stories with optional audio narration',
    icon: 'BookOpen',
    fields: [
      { id: 'ageGroup', name: 'Age Group', type: 'select', required: true, options: ['2-4 years', '4-6 years', '6-8 years', '8-10 years', '10-12 years'] },
      { id: 'theme', name: 'Story Theme', type: 'select', required: true, options: ['Adventure', 'Friendship', 'Learning', 'Fantasy', 'Animals', 'Family'] },
      { id: 'length', name: 'Story Length', type: 'select', required: true, options: ['Short (5-10 pages)', 'Medium (10-20 pages)', 'Long (20+ pages)'] },
      { id: 'lesson', name: 'Moral/Lesson', type: 'text', required: false, placeholder: 'What should children learn?' }
    ]
  },
  {
    id: 'ai-comic-book',
    name: 'AI Comic Book',
    category: 'Creative & Content',
    description: 'Generated comics with speech bubbles and characters per niche',
    icon: 'Zap',
    fields: [
      { id: 'genre', name: 'Comic Genre', type: 'select', required: true, options: ['Superhero', 'Adventure', 'Comedy', 'Educational', 'Slice of Life', 'Fantasy'] },
      { id: 'characters', name: 'Number of Characters', type: 'number', required: true, placeholder: '3' },
      { id: 'pages', name: 'Number of Pages', type: 'number', required: true, placeholder: '12' },
      { id: 'audience', name: 'Target Audience', type: 'select', required: true, options: ['Kids', 'Teens', 'Adults', 'All Ages'] }
    ]
  },
  {
    id: 'interactive-story-pdf',
    name: 'Interactive Story PDF',
    category: 'Creative & Content',
    description: 'Branching story choices with clickable options',
    icon: 'GitBranch',
    fields: [
      { id: 'genre', name: 'Story Genre', type: 'select', required: true, options: ['Mystery', 'Adventure', 'Romance', 'Sci-Fi', 'Fantasy', 'Thriller'] },
      { id: 'branches', name: 'Number of Branches', type: 'number', required: true, placeholder: '5' },
      { id: 'endings', name: 'Number of Endings', type: 'number', required: true, placeholder: '3' },
      { id: 'complexity', name: 'Story Complexity', type: 'select', required: true, options: ['Simple', 'Moderate', 'Complex'] }
    ]
  },
  {
    id: 'poetry-collection',
    name: 'Poetry Collection',
    category: 'Creative & Content',
    description: 'Customized poetry bundles by theme or audience',
    icon: 'Feather',
    fields: [
      { id: 'theme', name: 'Poetry Theme', type: 'select', required: true, options: ['Love', 'Nature', 'Life', 'Inspiration', 'Grief', 'Joy', 'Spirituality'] },
      { id: 'style', name: 'Poetry Style', type: 'select', required: true, options: ['Free Verse', 'Rhyming', 'Haiku', 'Sonnet', 'Mixed'] },
      { id: 'poems', name: 'Number of Poems', type: 'number', required: true, placeholder: '20' },
      { id: 'tone', name: 'Overall Tone', type: 'select', required: true, options: ['Uplifting', 'Melancholic', 'Passionate', 'Peaceful', 'Energetic'] }
    ]
  },
  {
    id: 'digital-art-prints',
    name: 'Digital Art Prints',
    category: 'Creative & Content',
    description: 'AI-generated wall art for niche tastes (e.g., vaporwave, minimalism)',
    icon: 'Image',
    fields: [
      { id: 'style', name: 'Art Style', type: 'select', required: true, options: ['Minimalist', 'Vaporwave', 'Abstract', 'Nature', 'Geometric', 'Vintage'] },
      { id: 'colorScheme', name: 'Color Scheme', type: 'select', required: true, options: ['Monochrome', 'Pastel', 'Vibrant', 'Earth Tones', 'Neon', 'Custom'] },
      { id: 'prints', name: 'Number of Prints', type: 'number', required: true, placeholder: '10' },
      { id: 'size', name: 'Print Size', type: 'select', required: true, options: ['8x10', '11x14', '16x20', '18x24', 'Multiple Sizes'] }
    ]
  },
  {
    id: 'meme-templates-pack',
    name: 'Meme Templates Pack',
    category: 'Creative & Content',
    description: 'Pre-sized image files + editable text layers for current formats',
    icon: 'Smile',
    fields: [
      { id: 'category', name: 'Meme Category', type: 'select', required: true, options: ['Business', 'Lifestyle', 'Tech', 'Fitness', 'Food', 'General'] },
      { id: 'templates', name: 'Number of Templates', type: 'number', required: true, placeholder: '25' },
      { id: 'format', name: 'Meme Format', type: 'select', required: true, options: ['Classic', 'Modern', 'Trending', 'Mixed'] },
      { id: 'platforms', name: 'Target Platforms', type: 'select', required: true, options: ['Instagram', 'Facebook', 'Twitter', 'All Platforms'] }
    ]
  }
]

// New Business & Marketing Assets
export const businessMarketingProducts: ProductType[] = [
  {
    id: 'cold-dm-scripts',
    name: 'Cold DM Scripts',
    category: 'Business & Marketing',
    description: 'Proven outreach scripts for IG, Twitter, LinkedIn',
    icon: 'MessageSquare',
    fields: [
      { id: 'platform', name: 'Platform', type: 'select', required: true, options: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'All Platforms'] },
      { id: 'purpose', name: 'Outreach Purpose', type: 'select', required: true, options: ['Sales', 'Networking', 'Collaboration', 'Lead Generation', 'Partnership'] },
      { id: 'industry', name: 'Target Industry', type: 'text', required: true, placeholder: 'What industry are you targeting?' },
      { id: 'scripts', name: 'Number of Scripts', type: 'number', required: true, placeholder: '15' }
    ]
  },
  {
    id: 'lead-scoring-template',
    name: 'Lead Scoring Template',
    category: 'Business & Marketing',
    description: 'Notion or Excel-based lead prioritization systems',
    icon: 'Target',
    fields: [
      { id: 'businessType', name: 'Business Type', type: 'select', required: true, options: ['B2B', 'B2C', 'SaaS', 'E-commerce', 'Service Business'] },
      { id: 'criteria', name: 'Scoring Criteria', type: 'number', required: true, placeholder: '8' },
      { id: 'format', name: 'Template Format', type: 'select', required: true, options: ['Excel', 'Google Sheets', 'Notion', 'Airtable'] },
      { id: 'complexity', name: 'Complexity Level', type: 'select', required: true, options: ['Simple', 'Intermediate', 'Advanced'] }
    ]
  },
  {
    id: 'affiliate-strategy-kit',
    name: 'Affiliate Strategy Kit',
    category: 'Business & Marketing',
    description: 'Templates, emails, tracking, and promo assets',
    icon: 'Users',
    fields: [
      { id: 'niche', name: 'Affiliate Niche', type: 'text', required: true, placeholder: 'What niche/industry?' },
      { id: 'strategy', name: 'Strategy Focus', type: 'select', required: true, options: ['Recruitment', 'Management', 'Promotion', 'Complete System'] },
      { id: 'templates', name: 'Number of Templates', type: 'number', required: true, placeholder: '12' },
      { id: 'level', name: 'Experience Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] }
    ]
  },
  {
    id: 'client-proposal-pack',
    name: 'Client Proposal Pack',
    category: 'Business & Marketing',
    description: 'Customizable proposals for freelancers or agencies',
    icon: 'FileText',
    fields: [
      { id: 'serviceType', name: 'Service Type', type: 'select', required: true, options: ['Design', 'Development', 'Marketing', 'Consulting', 'Writing', 'General'] },
      { id: 'clientType', name: 'Client Type', type: 'select', required: true, options: ['Small Business', 'Enterprise', 'Startup', 'Non-Profit', 'Mixed'] },
      { id: 'proposals', name: 'Number of Proposals', type: 'number', required: true, placeholder: '5' },
      { id: 'complexity', name: 'Project Complexity', type: 'select', required: true, options: ['Simple', 'Medium', 'Complex', 'All Levels'] }
    ]
  },
  {
    id: 'pitch-deck-template',
    name: 'Pitch Deck Template',
    category: 'Business & Marketing',
    description: 'For startups, creators, freelancers (with AI-enhanced content)',
    icon: 'Presentation',
    fields: [
      { id: 'purpose', name: 'Pitch Purpose', type: 'select', required: true, options: ['Investor Funding', 'Client Presentation', 'Partnership', 'Product Launch', 'General'] },
      { id: 'industry', name: 'Industry/Sector', type: 'text', required: true, placeholder: 'What industry?' },
      { id: 'slides', name: 'Number of Slides', type: 'select', required: true, options: ['10-12 slides', '15-18 slides', '20+ slides'] },
      { id: 'stage', name: 'Business Stage', type: 'select', required: true, options: ['Idea Stage', 'MVP', 'Early Revenue', 'Growth Stage'] }
    ]
  },
  {
    id: 'funnel-maps-frameworks',
    name: 'Funnel Maps & Frameworks',
    category: 'Business & Marketing',
    description: 'Visual guides + text breakdowns for digital sales funnels',
    icon: 'TrendingDown',
    fields: [
      { id: 'funnelType', name: 'Funnel Type', type: 'select', required: true, options: ['Lead Generation', 'Sales', 'Webinar', 'Product Launch', 'E-commerce'] },
      { id: 'businessModel', name: 'Business Model', type: 'select', required: true, options: ['B2B', 'B2C', 'SaaS', 'E-commerce', 'Service'] },
      { id: 'stages', name: 'Funnel Stages', type: 'number', required: true, placeholder: '5' },
      { id: 'complexity', name: 'Complexity Level', type: 'select', required: true, options: ['Basic', 'Intermediate', 'Advanced'] }
    ]
  },
  {
    id: 'client-feedback-forms',
    name: 'Client Feedback Forms',
    category: 'Business & Marketing',
    description: 'Editable and brandable forms to collect reviews or feedback',
    icon: 'MessageCircle',
    fields: [
      { id: 'serviceType', name: 'Service Type', type: 'text', required: true, placeholder: 'What service do you provide?' },
      { id: 'formType', name: 'Form Type', type: 'select', required: true, options: ['Project Feedback', 'Service Review', 'Testimonial Collection', 'General Feedback'] },
      { id: 'questions', name: 'Number of Questions', type: 'number', required: true, placeholder: '10' },
      { id: 'format', name: 'Form Format', type: 'select', required: true, options: ['Google Forms', 'Typeform', 'PDF', 'Word Document'] }
    ]
  }
]

// Additional Business & Marketing Assets (9 more types)
export const additionalBusinessProducts: ProductType[] = [
  {
    id: 'launch-checklists',
    name: 'Launch Checklists',
    category: 'Business & Marketing',
    description: 'For creators, product managers, or startup founders',
    icon: 'Rocket',
    fields: [
      { id: 'launchType', name: 'Launch Type', type: 'select', required: true, options: ['Product Launch', 'Service Launch', 'Website Launch', 'App Launch', 'Course Launch'] },
      { id: 'timeline', name: 'Launch Timeline', type: 'select', required: true, options: ['2 Weeks', '1 Month', '3 Months', '6 Months'] },
      { id: 'complexity', name: 'Launch Complexity', type: 'select', required: true, options: ['Simple', 'Moderate', 'Complex'] },
      { id: 'team', name: 'Team Size', type: 'select', required: true, options: ['Solo', 'Small Team (2-5)', 'Large Team (6+)'] }
    ]
  },
  {
    id: 'dm-engagement-scripts',
    name: 'DM & Comment Engagement Scripts',
    category: 'Business & Marketing',
    description: 'For community building and follower growth',
    icon: 'MessageSquare',
    fields: [
      { id: 'platform', name: 'Platform', type: 'select', required: true, options: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok', 'All Platforms'] },
      { id: 'purpose', name: 'Engagement Purpose', type: 'select', required: true, options: ['Community Building', 'Lead Generation', 'Brand Awareness', 'Customer Support'] },
      { id: 'scripts', name: 'Number of Scripts', type: 'number', required: true, placeholder: '20' },
      { id: 'tone', name: 'Engagement Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Friendly', 'Humorous'] }
    ]
  },
  {
    id: 'etsy-seller-startup-kit',
    name: 'Etsy Seller Startup Kit',
    category: 'Business & Marketing',
    description: 'SEO tags, listing templates, design mockups, email ideas',
    icon: 'ShoppingBag',
    fields: [
      { id: 'productCategory', name: 'Product Category', type: 'select', required: true, options: ['Handmade', 'Digital Downloads', 'Vintage', 'Craft Supplies', 'Art'] },
      { id: 'niche', name: 'Specific Niche', type: 'text', required: true, placeholder: 'What specific niche?' },
      { id: 'listings', name: 'Number of Listing Templates', type: 'number', required: true, placeholder: '10' },
      { id: 'experience', name: 'Seller Experience', type: 'select', required: true, options: ['Complete Beginner', 'Some Experience', 'Experienced'] }
    ]
  },
  {
    id: 'amazon-kdp-book-bundle',
    name: 'Amazon KDP Book Bundle',
    category: 'Business & Marketing',
    description: 'Interiors, cover prompts, title/description generator',
    icon: 'Book',
    fields: [
      { id: 'bookType', name: 'Book Type', type: 'select', required: true, options: ['Fiction', 'Non-Fiction', 'Journal/Planner', 'Activity Book', 'Coloring Book'] },
      { id: 'genre', name: 'Genre/Niche', type: 'text', required: true, placeholder: 'What genre or niche?' },
      { id: 'pages', name: 'Target Page Count', type: 'select', required: true, options: ['50-100 pages', '100-200 pages', '200+ pages'] },
      { id: 'audience', name: 'Target Audience', type: 'select', required: true, options: ['Children', 'Teens', 'Adults', 'Seniors', 'All Ages'] }
    ]
  },
  {
    id: 'onlyfans-creator-pack',
    name: 'OnlyFans Creator Pack',
    category: 'Business & Marketing',
    description: 'Caption banks, content calendars, persona strategy guides',
    icon: 'Users',
    fields: [
      { id: 'contentStyle', name: 'Content Style', type: 'select', required: true, options: ['Lifestyle', 'Fitness', 'Art/Creative', 'Educational', 'Entertainment'] },
      { id: 'postingFrequency', name: 'Posting Frequency', type: 'select', required: true, options: ['Daily', '3-4 times/week', 'Weekly', 'Custom Schedule'] },
      { id: 'captions', name: 'Number of Captions', type: 'number', required: true, placeholder: '50' },
      { id: 'strategy', name: 'Strategy Focus', type: 'select', required: true, options: ['Growth', 'Engagement', 'Monetization', 'Complete System'] }
    ]
  },
  {
    id: 'realtor-marketing-template',
    name: 'Realtor Marketing Template',
    category: 'Business & Marketing',
    description: 'Flyers, open house scripts, email drips',
    icon: 'Home',
    fields: [
      { id: 'propertyType', name: 'Property Type', type: 'select', required: true, options: ['Residential', 'Commercial', 'Luxury', 'First-Time Buyers', 'Investment'] },
      { id: 'marketArea', name: 'Market Area', type: 'select', required: true, options: ['Urban', 'Suburban', 'Rural', 'Luxury Market', 'Mixed'] },
      { id: 'materials', name: 'Marketing Materials', type: 'number', required: true, placeholder: '15' },
      { id: 'experience', name: 'Realtor Experience', type: 'select', required: true, options: ['New Agent', 'Experienced', 'Team Leader'] }
    ]
  },
  {
    id: 'local-business-seo-kit',
    name: 'Local Business SEO Kit',
    category: 'Business & Marketing',
    description: 'Google profile prompts, review templates, blog ideas',
    icon: 'MapPin',
    fields: [
      { id: 'businessType', name: 'Business Type', type: 'text', required: true, placeholder: 'What type of business?' },
      { id: 'location', name: 'Location Type', type: 'select', required: true, options: ['Single Location', 'Multiple Locations', 'Service Area', 'Online + Local'] },
      { id: 'competition', name: 'Competition Level', type: 'select', required: true, options: ['Low', 'Moderate', 'High', 'Very High'] },
      { id: 'goals', name: 'SEO Goals', type: 'select', required: true, options: ['Visibility', 'Reviews', 'Traffic', 'Complete Strategy'] }
    ]
  },
  {
    id: 'wedding-vendor-pack',
    name: 'Wedding Vendor Pack',
    category: 'Business & Marketing',
    description: 'Packages for planners, photographers, florists, etc.',
    icon: 'Heart',
    fields: [
      { id: 'vendorType', name: 'Vendor Type', type: 'select', required: true, options: ['Wedding Planner', 'Photographer', 'Florist', 'Caterer', 'DJ/Music', 'Venue'] },
      { id: 'serviceLevel', name: 'Service Level', type: 'select', required: true, options: ['Budget', 'Mid-Range', 'Luxury', 'All Levels'] },
      { id: 'packages', name: 'Number of Packages', type: 'number', required: true, placeholder: '5' },
      { id: 'season', name: 'Target Season', type: 'select', required: true, options: ['Spring', 'Summer', 'Fall', 'Winter', 'Year-Round'] }
    ]
  },
  {
    id: 'spiritual-business-starter-kit',
    name: 'Spiritual Business Starter Kit',
    category: 'Business & Marketing',
    description: 'Affirmations, meditations, pricing tiers, client forms',
    icon: 'Star',
    fields: [
      { id: 'spiritualNiche', name: 'Spiritual Niche', type: 'select', required: true, options: ['Life Coaching', 'Tarot/Oracle', 'Energy Healing', 'Meditation', 'Astrology', 'General Spiritual'] },
      { id: 'serviceType', name: 'Service Type', type: 'select', required: true, options: ['1-on-1 Sessions', 'Group Sessions', 'Digital Products', 'Courses', 'Mixed Services'] },
      { id: 'materials', name: 'Number of Materials', type: 'number', required: true, placeholder: '20' },
      { id: 'experience', name: 'Business Experience', type: 'select', required: true, options: ['Just Starting', 'Some Experience', 'Established Practice'] }
    ]
  }
]

// Learning & Professional Growth Products (7 types)
export const learningProfessionalProducts: ProductType[] = [
  {
    id: 'mini-email-course',
    name: 'Mini Email Course',
    category: 'Learning & Professional Growth',
    description: '3–7-day educational sequences for list building',
    icon: 'GraduationCap',
    fields: [
      { id: 'topic', name: 'Course Topic', type: 'text', required: true, placeholder: 'What will you teach?' },
      { id: 'duration', name: 'Course Duration', type: 'select', required: true, options: ['3 Days', '5 Days', '7 Days', '10 Days'] },
      { id: 'level', name: 'Skill Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
      { id: 'outcome', name: 'Learning Outcome', type: 'text', required: true, placeholder: 'What will students achieve?' }
    ]
  },
  {
    id: 'microlearning-cards',
    name: 'Microlearning Cards',
    category: 'Learning & Professional Growth',
    description: 'Bite-sized lessons per card (PDF or app-compatible)',
    icon: 'CreditCard',
    fields: [
      { id: 'subject', name: 'Subject Area', type: 'text', required: true, placeholder: 'What subject?' },
      { id: 'cards', name: 'Number of Cards', type: 'number', required: true, placeholder: '30' },
      { id: 'format', name: 'Card Format', type: 'select', required: true, options: ['PDF Cards', 'Digital Flashcards', 'Print-Ready', 'App Format'] },
      { id: 'difficulty', name: 'Difficulty Level', type: 'select', required: true, options: ['Basic', 'Intermediate', 'Advanced', 'Mixed'] }
    ]
  },
  {
    id: 'exam-study-kit',
    name: 'Exam Study Kit',
    category: 'Learning & Professional Growth',
    description: 'Condensed cheat sheets, flashcards, and practice questions',
    icon: 'FileText',
    fields: [
      { id: 'examType', name: 'Exam Type', type: 'text', required: true, placeholder: 'What exam or certification?' },
      { id: 'studyMaterials', name: 'Study Materials', type: 'select', required: true, options: ['Cheat Sheets Only', 'Flashcards Only', 'Practice Questions', 'Complete Kit'] },
      { id: 'questions', name: 'Number of Questions', type: 'number', required: true, placeholder: '100' },
      { id: 'timeframe', name: 'Study Timeframe', type: 'select', required: true, options: ['1 Week', '2 Weeks', '1 Month', '3 Months'] }
    ]
  },
  {
    id: 'coaching-blueprint',
    name: 'Coaching Blueprint',
    category: 'Learning & Professional Growth',
    description: 'Structure for a 4, 6, or 12-week coaching program',
    icon: 'Users',
    fields: [
      { id: 'coachingNiche', name: 'Coaching Niche', type: 'text', required: true, placeholder: 'What type of coaching?' },
      { id: 'duration', name: 'Program Duration', type: 'select', required: true, options: ['4 Weeks', '6 Weeks', '8 Weeks', '12 Weeks'] },
      { id: 'format', name: 'Coaching Format', type: 'select', required: true, options: ['1-on-1', 'Group Coaching', 'Hybrid', 'Self-Paced'] },
      { id: 'outcome', name: 'Desired Outcome', type: 'text', required: true, placeholder: 'What transformation will clients achieve?' }
    ]
  },
  {
    id: 'public-speaking-toolkit',
    name: 'Public Speaking Toolkit',
    category: 'Learning & Professional Growth',
    description: 'Icebreakers, outlines, anxiety hacks, and body language guides',
    icon: 'Mic',
    fields: [
      { id: 'speakingType', name: 'Speaking Type', type: 'select', required: true, options: ['Business Presentations', 'Conference Talks', 'Wedding Speeches', 'General Public Speaking'] },
      { id: 'experience', name: 'Speaker Experience', type: 'select', required: true, options: ['Complete Beginner', 'Some Experience', 'Experienced', 'All Levels'] },
      { id: 'tools', name: 'Number of Tools/Templates', type: 'number', required: true, placeholder: '15' },
      { id: 'focus', name: 'Primary Focus', type: 'select', required: true, options: ['Overcoming Anxiety', 'Content Structure', 'Delivery Skills', 'Complete System'] }
    ]
  },
  {
    id: 'ai-career-tools',
    name: 'AI Career Tools',
    category: 'Learning & Professional Growth',
    description: 'Resume + portfolio + job pitch optimized with AI keywords',
    icon: 'Briefcase',
    fields: [
      { id: 'industry', name: 'Target Industry', type: 'text', required: true, placeholder: 'What industry?' },
      { id: 'careerLevel', name: 'Career Level', type: 'select', required: true, options: ['Entry Level', 'Mid-Level', 'Senior Level', 'Executive', 'Career Change'] },
      { id: 'tools', name: 'Tools Included', type: 'select', required: true, options: ['Resume Only', 'Resume + Cover Letter', 'Complete Package', 'Portfolio Focus'] },
      { id: 'aiOptimization', name: 'AI Optimization', type: 'select', required: true, options: ['ATS Optimization', 'LinkedIn Optimization', 'Complete AI Strategy'] }
    ]
  },
  {
    id: 'freelancer-welcome-kit',
    name: 'Freelancer Welcome Kit',
    category: 'Learning & Professional Growth',
    description: 'Project timelines, expectations, and brand assets',
    icon: 'UserCheck',
    fields: [
      { id: 'freelanceType', name: 'Freelance Type', type: 'select', required: true, options: ['Design', 'Development', 'Writing', 'Marketing', 'Consulting', 'General'] },
      { id: 'clientType', name: 'Client Type', type: 'select', required: true, options: ['Small Business', 'Startups', 'Agencies', 'Enterprise', 'Mixed'] },
      { id: 'materials', name: 'Number of Materials', type: 'number', required: true, placeholder: '12' },
      { id: 'experience', name: 'Freelancer Experience', type: 'select', required: true, options: ['New Freelancer', 'Experienced', 'Agency Owner'] }
    ]
  }
]

// Automation-Driven Products (5 types)
export const automationProducts: ProductType[] = [
  {
    id: 'chatbot-scripts',
    name: 'Chatbot Scripts',
    category: 'Automation-Driven Products',
    description: 'Custom scripts for different industries or support goals',
    icon: 'Bot',
    fields: [
      { id: 'industry', name: 'Industry/Niche', type: 'text', required: true, placeholder: 'What industry?' },
      { id: 'purpose', name: 'Chatbot Purpose', type: 'select', required: true, options: ['Customer Support', 'Lead Generation', 'Sales', 'FAQ', 'Booking'] },
      { id: 'platform', name: 'Platform', type: 'select', required: true, options: ['Website', 'Facebook Messenger', 'WhatsApp', 'Telegram', 'Multi-Platform'] },
      { id: 'complexity', name: 'Script Complexity', type: 'select', required: true, options: ['Simple', 'Moderate', 'Advanced', 'AI-Powered'] }
    ]
  },
  {
    id: 'automation-workflows',
    name: 'Automation Workflows',
    category: 'Automation-Driven Products',
    description: 'Zapier or Make blueprints for creators, solopreneurs, etc.',
    icon: 'Zap',
    fields: [
      { id: 'businessType', name: 'Business Type', type: 'select', required: true, options: ['Creator/Influencer', 'Solopreneur', 'Small Business', 'E-commerce', 'Service Business'] },
      { id: 'platform', name: 'Automation Platform', type: 'select', required: true, options: ['Zapier', 'Make (Integromat)', 'Both', 'Platform Agnostic'] },
      { id: 'workflows', name: 'Number of Workflows', type: 'number', required: true, placeholder: '10' },
      { id: 'complexity', name: 'Workflow Complexity', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Mixed'] }
    ]
  },
  {
    id: 'prompt-libraries-niche',
    name: 'Prompt Libraries by Niche',
    category: 'Automation-Driven Products',
    description: 'For ChatGPT, Midjourney, DALL·E, or Photoshop plugins',
    icon: 'Command',
    fields: [
      { id: 'niche', name: 'Niche/Industry', type: 'text', required: true, placeholder: 'What niche?' },
      { id: 'aiTool', name: 'AI Tool Focus', type: 'select', required: true, options: ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Mixed AI Tools'] },
      { id: 'prompts', name: 'Number of Prompts', type: 'number', required: true, placeholder: '100' },
      { id: 'category', name: 'Prompt Category', type: 'select', required: true, options: ['Content Creation', 'Image Generation', 'Business', 'Creative', 'Technical'] }
    ]
  },
  {
    id: 'custom-gpts-digital-products',
    name: 'Custom GPTs as Digital Products',
    category: 'Automation-Driven Products',
    description: 'Productized GPTs with branding and instructions',
    icon: 'Cpu',
    fields: [
      { id: 'gptPurpose', name: 'GPT Purpose', type: 'text', required: true, placeholder: 'What will this GPT do?' },
      { id: 'niche', name: 'Target Niche', type: 'text', required: true, placeholder: 'What niche/industry?' },
      { id: 'features', name: 'Key Features', type: 'number', required: true, placeholder: '5' },
      { id: 'complexity', name: 'GPT Complexity', type: 'select', required: true, options: ['Simple Assistant', 'Specialized Tool', 'Complex System', 'Multi-Function'] }
    ]
  },
  {
    id: 'ai-tools-review-pack',
    name: 'AI Tools Review Pack',
    category: 'Automation-Driven Products',
    description: 'Curated reviews and recommendations by niche',
    icon: 'Star',
    fields: [
      { id: 'niche', name: 'Review Niche', type: 'text', required: true, placeholder: 'What niche/category?' },
      { id: 'tools', name: 'Number of Tools', type: 'number', required: true, placeholder: '25' },
      { id: 'reviewDepth', name: 'Review Depth', type: 'select', required: true, options: ['Quick Overview', 'Detailed Review', 'Comparison Focus', 'Complete Analysis'] },
      { id: 'format', name: 'Review Format', type: 'select', required: true, options: ['Written Reviews', 'Video Scripts', 'Comparison Charts', 'Complete Guide'] }
    ]
  }
]

// Self-Help & Lifestyle Products (4 types)
export const selfHelpLifestyleProducts: ProductType[] = [
  {
    id: 'habit-tracker-boards',
    name: 'Habit Tracker Boards',
    category: 'Self-Help & Lifestyle',
    description: 'Notion or printable templates',
    icon: 'CheckCircle',
    fields: [
      { id: 'habitType', name: 'Habit Type', type: 'select', required: true, options: ['Health & Fitness', 'Productivity', 'Personal Development', 'Creative', 'Mixed'] },
      { id: 'format', name: 'Tracker Format', type: 'select', required: true, options: ['Notion Template', 'Printable PDF', 'Digital Planner', 'All Formats'] },
      { id: 'duration', name: 'Tracking Duration', type: 'select', required: true, options: ['30 Days', '90 Days', '365 Days', 'Flexible'] },
      { id: 'habits', name: 'Number of Habits', type: 'number', required: true, placeholder: '10' }
    ]
  },
  {
    id: 'shadow-work-journal',
    name: 'Shadow Work Journal',
    category: 'Self-Help & Lifestyle',
    description: 'Pre-written prompts, introspection questions, examples',
    icon: 'Moon',
    fields: [
      { id: 'approach', name: 'Approach Style', type: 'select', required: true, options: ['Gentle Introduction', 'Deep Dive', 'Structured Program', 'Flexible Exploration'] },
      { id: 'prompts', name: 'Number of Prompts', type: 'number', required: true, placeholder: '50' },
      { id: 'duration', name: 'Journal Duration', type: 'select', required: true, options: ['30 Days', '60 Days', '90 Days', 'Self-Paced'] },
      { id: 'experience', name: 'Experience Level', type: 'select', required: true, options: ['Beginner', 'Some Experience', 'Advanced', 'All Levels'] }
    ]
  },
  {
    id: 'parenting-activity-pack',
    name: 'Parenting Activity Pack',
    category: 'Self-Help & Lifestyle',
    description: 'Digital worksheets for toddlers, teens, and family bonding',
    icon: 'Users',
    fields: [
      { id: 'ageGroup', name: 'Age Group', type: 'select', required: true, options: ['Toddlers (2-4)', 'Preschool (4-6)', 'Elementary (6-10)', 'Teens (13-18)', 'Mixed Ages'] },
      { id: 'activityType', name: 'Activity Type', type: 'select', required: true, options: ['Educational', 'Creative', 'Physical', 'Bonding', 'Mixed Activities'] },
      { id: 'activities', name: 'Number of Activities', type: 'number', required: true, placeholder: '25' },
      { id: 'format', name: 'Activity Format', type: 'select', required: true, options: ['Printable Worksheets', 'Digital Activities', 'Game Instructions', 'Complete Kit'] }
    ]
  },
  {
    id: 'self-discovery-toolkit',
    name: 'Self-Discovery Toolkit',
    category: 'Self-Help & Lifestyle',
    description: 'Personality tests, vision questions, value sorters',
    icon: 'Compass',
    fields: [
      { id: 'focus', name: 'Discovery Focus', type: 'select', required: true, options: ['Personality', 'Values & Beliefs', 'Life Purpose', 'Career Direction', 'Complete Self-Discovery'] },
      { id: 'tools', name: 'Number of Tools', type: 'number', required: true, placeholder: '15' },
      { id: 'depth', name: 'Exploration Depth', type: 'select', required: true, options: ['Surface Level', 'Moderate Depth', 'Deep Exploration', 'Comprehensive'] },
      { id: 'format', name: 'Toolkit Format', type: 'select', required: true, options: ['Interactive PDF', 'Workbook Style', 'Assessment Format', 'Mixed Formats'] }
    ]
  }
]

export const allProductTypes = [
  ...productTypes, 
  ...additionalProductTypes, 
  ...creativeContentProducts, 
  ...businessMarketingProducts,
  ...additionalBusinessProducts,
  ...learningProfessionalProducts,
  ...automationProducts,
  ...selfHelpLifestyleProducts
]