/**
 * Seed Data for Plant Disease Identifier
 * This file contains comprehensive sample data for plants, symptoms, and diseases
 * Run this file to populate your MongoDB database with initial data
 */

const mongoose = require('mongoose');
const Plant = require('../models/Plant');
const Symptom = require('../models/Symptom');
const Disease = require('../models/Disease');

// Plant Data
const plantData = [
    {
        name: 'Tomato',
        scientificName: 'Solanum lycopersicum',
        description: 'A widely cultivated fruit vegetable, susceptible to various fungal and bacterial diseases',
        commonVarieties: ['Roma', 'Cherry', 'Beefsteak', 'Plum'],
        image: 'https://example.com/tomato.jpg'
    },
    {
        name: 'Potato',
        scientificName: 'Solanum tuberosum',
        description: 'A starchy tuber crop that is prone to several soil-borne and foliar diseases',
        commonVarieties: ['Russet', 'Yukon Gold', 'Red Pontiac', 'Kennebec'],
        image: 'https://example.com/potato.jpg'
    },
    {
        name: 'Rice',
        scientificName: 'Oryza sativa',
        description: 'A staple grain crop that faces various fungal and bacterial infections',
        commonVarieties: ['Basmati', 'Jasmine', 'Arborio', 'Brown Rice'],
        image: 'https://example.com/rice.jpg'
    },
    {
        name: 'Wheat',
        scientificName: 'Triticum aestivum',
        description: 'A primary cereal crop affected by rusts, smuts, and other fungal diseases',
        commonVarieties: ['Hard Red Spring', 'Soft White', 'Durum'],
        image: 'https://example.com/wheat.jpg'
    },
    {
        name: 'Chili',
        scientificName: 'Capsicum annuum',
        description: 'A spicy vegetable crop vulnerable to viral and fungal infections',
        commonVarieties: ['Bell Pepper', 'Jalapeño', 'Cayenne', 'Habanero'],
        image: 'https://example.com/chili.jpg'
    }
];

// Symptom Data - Comprehensive list of plant symptoms
const symptomData = [
    // Leaf Symptoms
    { name: 'Yellowing of leaves', category: 'leaf', description: 'Leaves turn yellow, starting from lower or upper leaves', severity: 'medium' },
    { name: 'Brown leaf spots', category: 'leaf', description: 'Circular or irregular brown spots on leaf surface', severity: 'medium' },
    { name: 'Black leaf spots', category: 'leaf', description: 'Dark black spots with yellow halos on leaves', severity: 'high' },
    { name: 'Leaf curling', category: 'leaf', description: 'Leaves curl upward or downward abnormally', severity: 'medium' },
    { name: 'Leaf wilting', category: 'leaf', description: 'Leaves droop and lose turgidity', severity: 'high' },
    { name: 'Leaf drop', category: 'leaf', description: 'Premature falling of leaves', severity: 'medium' },
    { name: 'White powdery growth on leaves', category: 'leaf', description: 'White fungal growth resembling powder on leaf surface', severity: 'medium' },
    { name: 'Water-soaked spots on leaves', category: 'leaf', description: 'Dark, water-soaked areas on leaf surface', severity: 'high' },
    { name: 'Holes in leaves', category: 'leaf', description: 'Irregular holes or feeding damage on leaves', severity: 'low' },
    { name: 'Purple discoloration on leaves', category: 'leaf', description: 'Leaves develop purple or reddish discoloration', severity: 'medium' },
    
    // Stem Symptoms
    { name: 'Stem cankers', category: 'stem', description: 'Sunken, dead areas on stems', severity: 'high' },
    { name: 'Stem rot', category: 'stem', description: 'Soft, decaying stem tissue', severity: 'critical' },
    { name: 'Dark streaks on stem', category: 'stem', description: 'Dark colored streaks or lines on stem surface', severity: 'medium' },
    { name: 'Stem swelling', category: 'stem', description: 'Abnormal swelling or thickening of stems', severity: 'low' },
    
    // Fruit Symptoms
    { name: 'Fruit spots', category: 'fruit', description: 'Spots or lesions on fruit surface', severity: 'high' },
    { name: 'Fruit rot', category: 'fruit', description: 'Soft, decaying areas on fruits', severity: 'critical' },
    { name: 'Premature fruit drop', category: 'fruit', description: 'Fruits fall before ripening', severity: 'high' },
    { name: 'Deformed fruits', category: 'fruit', description: 'Fruits develop abnormal shapes', severity: 'medium' },
    { name: 'Internal fruit discoloration', category: 'fruit', description: 'Unusual colors inside the fruit', severity: 'high' },
    
    // Root Symptoms
    { name: 'Root rot', category: 'root', description: 'Decaying or discolored root system', severity: 'critical' },
    { name: 'Stunted root growth', category: 'root', description: 'Poor root development and growth', severity: 'high' },
    { name: 'Root galls', category: 'root', description: 'Swollen or knotted root tissues', severity: 'medium' },
    
    // General Symptoms
    { name: 'Stunted growth', category: 'general', description: 'Overall poor plant growth and development', severity: 'medium' },
    { name: 'Damping off', category: 'general', description: 'Seedling collapse and death', severity: 'critical' },
    { name: 'Chlorosis', category: 'general', description: 'Yellowing due to lack of chlorophyll', severity: 'medium' },
    { name: 'Necrosis', category: 'general', description: 'Death of plant tissues', severity: 'high' },
    { name: 'Mosaic pattern on leaves', category: 'general', description: 'Irregular light and dark green patches', severity: 'high' }
];

// Disease Data - Common plant diseases with their symptoms
const diseaseData = [
    // Tomato Diseases
    {
        name: 'Early Blight',
        scientificName: 'Alternaria solani',
        plant: null, // Will be populated later
        symptoms: [], // Will be populated later
        description: 'A fungal disease causing dark spots on leaves, stems, and fruits',
        cause: 'Fungus Alternaria solani, favored by warm, wet conditions',
        preventiveMeasures: [
            'Remove infected plant debris',
            'Ensure proper air circulation',
            'Water at soil level, not on leaves',
            'Apply preventive fungicide',
            'Rotate crops annually'
        ],
        treatment: {
            chemical: [
                { name: 'Chlorothalonil', dosage: '2-3 tsp per gallon water', application: 'Spray every 7-10 days' },
                { name: 'Mancozeb', dosage: '2 tbsp per gallon water', application: 'Spray at first sign of disease' }
            ],
            organic: [
                { method: 'Neem Oil Spray', instructions: 'Mix 2 tbsp neem oil in 1 gallon water, spray weekly' },
                { method: 'Baking Soda Spray', instructions: 'Mix 1 tbsp baking soda + 1 tsp soap in 1 gallon water' }
            ],
            cultural: [
                { practice: 'Mulching', description: 'Apply organic mulch to prevent soil splash' },
                { practice: 'Pruning', description: 'Remove lower leaves to improve air flow' }
            ]
        },
        severity: 'medium',
        commonIn: 'monsoon'
    },
    {
        name: 'Late Blight',
        scientificName: 'Phytophthora infestans',
        plant: null,
        symptoms: [],
        description: 'A destructive fungal disease causing water-soaked lesions on all plant parts',
        cause: 'Fungus-like organism Phytophthora infestans, spreads rapidly in cool, wet weather',
        preventiveMeasures: [
            'Plant resistant varieties',
            'Avoid overhead irrigation',
            'Remove volunteer potatoes and tomatoes',
            'Destroy infected plants immediately'
        ],
        treatment: {
            chemical: [
                { name: 'Copper Fungicide', dosage: '1-2 tbsp per gallon water', application: 'Apply before symptoms appear' },
                { name: 'Metalaxyl', dosage: 'As per label instructions', application: 'Systemic fungicide application' }
            ],
            organic: [
                { method: 'Copper Soap Spray', instructions: 'Apply copper soap fungicide as preventive measure' },
                { method: 'Remove Infected Parts', instructions: 'Cut and destroy infected plant parts immediately' }
            ],
            cultural: [
                { practice: 'Proper Spacing', description: 'Provide adequate space between plants' },
                { practice: 'Avoid Working Wet Plants', description: 'Do not handle plants when wet' }
            ]
        },
        severity: 'critical',
        commonIn: 'monsoon'
    },
    {
        name: 'Bacterial Wilt',
        scientificName: 'Ralstonia solanacearum',
        plant: null,
        symptoms: [],
        description: 'A bacterial disease causing sudden wilting and death of plants',
        cause: 'Bacterium Ralstonia solanacearum, survives in soil for long periods',
        preventiveMeasures: [
            'Use disease-free seeds and transplants',
            'Rotate with non-solanaceous crops',
            'Improve soil drainage',
            'Control root-knot nematodes'
        ],
        treatment: {
            chemical: [
                { name: 'Streptomycin', dosage: 'As per label', application: 'Apply to soil before planting' }
            ],
            organic: [
                { method: 'Soil Solarization', instructions: 'Cover soil with plastic during hot months' },
                { method: 'Compost Addition', instructions: 'Add well-decomposed compost to improve soil health' }
            ],
            cultural: [
                { practice: 'Crop Rotation', description: 'Rotate with cereals or legumes' },
                { practice: 'Remove Infected Plants', description: 'Uproot and destroy infected plants' }
            ]
        },
        severity: 'critical',
        commonIn: 'summer'
    },
    
    // Potato Diseases
    {
        name: 'Potato Scab',
        scientificName: 'Streptomyces scabies',
        plant: null,
        symptoms: [],
        description: 'A bacterial disease causing rough, scabby lesions on potato tubers',
        cause: 'Bacterium Streptomyces scabies, favored by alkaline soil conditions',
        preventiveMeasures: [
            'Maintain soil pH below 5.5',
            'Use scab-resistant varieties',
            'Ensure adequate soil moisture',
            'Rotate with non-solanaceous crops'
        ],
        treatment: {
            chemical: [
                { name: 'PCNB (Pentachloronitrobenzene)', dosage: 'As per label', application: 'Apply at planting time' }
            ],
            organic: [
                { method: 'Acidify Soil', instructions: 'Add sulfur to lower soil pH' },
                { method: 'Mulching', instructions: 'Maintain consistent soil moisture with mulch' }
            ],
            cultural: [
                { practice: 'Proper Irrigation', description: 'Keep soil consistently moist during tuber formation' },
                { practice: 'Green Manure', description: 'Incorporate acid-forming organic matter' }
            ]
        },
        severity: 'low',
        commonIn: 'all_season'
    },
    {
        name: 'Black Scurf',
        scientificName: 'Rhizoctonia solani',
        plant: null,
        symptoms: [],
        description: 'A fungal disease causing black spots on tubers and stem cankers',
        cause: 'Fungus Rhizoctonia solani, survives in soil and plant debris',
        preventiveMeasures: [
            'Use certified seed potatoes',
            'Avoid planting in cold, wet soil',
            'Remove plant debris',
            'Practice crop rotation'
        ],
        treatment: {
            chemical: [
                { name: 'Azoxystrobin', dosage: 'As per label', application: 'Apply as seed treatment' }
            ],
            organic: [
                { method: 'Trichoderma Treatment', instructions: 'Treat seed with Trichoderma biofungicide' },
                { method: 'Proper Curing', instructions: 'Cure tubers properly before storage' }
            ],
            cultural: [
                { practice: 'Warm Soil Planting', description: 'Plant when soil temperature is above 45°F' },
                { practice: 'Hilling', description: 'Proper hilling to protect tubers' }
            ]
        },
        severity: 'medium',
        commonIn: 'spring'
    },
    
    // Rice Diseases
    {
        name: 'Rice Blast',
        scientificName: 'Magnaporthe oryzae',
        plant: null,
        symptoms: [],
        description: 'A fungal disease causing diamond-shaped lesions on leaves and panicles',
        cause: 'Fungus Magnaporthe oryzae, most destructive rice disease worldwide',
        preventiveMeasures: [
            'Use resistant varieties',
            'Avoid excessive nitrogen fertilization',
            'Ensure proper water management',
            'Destroy crop residues'
        ],
        treatment: {
            chemical: [
                { name: 'Tricyclazole', dosage: 'As per label', application: 'Apply at first sign of disease' },
                { name: 'Isoprothiolane', dosage: 'As per label', application: 'Systemic fungicide application' }
            ],
            organic: [
                { method: 'Silicon Fertilization', instructions: 'Apply silicon-rich fertilizers to strengthen plants' },
                { method: 'Neem Cake', instructions: 'Apply neem cake to soil' }
            ],
            cultural: [
                { practice: 'Balanced Fertilization', description: 'Avoid excessive nitrogen, maintain NPK balance' },
                { practice: 'Proper Drainage', description: 'Avoid continuous flooding' }
            ]
        },
        severity: 'critical',
        commonIn: 'monsoon'
    },
    {
        name: 'Bacterial Leaf Blight',
        scientificName: 'Xanthomonas oryzae pv. oryzae',
        plant: null,
        symptoms: [],
        description: 'A bacterial disease causing wilting and drying of rice leaves',
        cause: 'Bacterium Xanthomonas oryzae, spreads through water and infected seeds',
        preventiveMeasures: [
            'Use disease-free seeds',
            'Practice fallow period',
            'Avoid excessive nitrogen',
            'Improve drainage'
        ],
        treatment: {
            chemical: [
                { name: 'Copper Oxychloride', dosage: '2.5 g per liter water', application: 'Spray when symptoms appear' }
            ],
            organic: [
                { method: 'Seed Treatment', instructions: 'Treat seeds with hot water (52°C for 30 minutes)' },
                { method: 'Streptocycline Spray', instructions: 'Use agricultural streptocycline as per instructions' }
            ],
            cultural: [
                { practice: 'Crop Rotation', description: 'Rotate with non-host crops' },
                { practice: 'Weed Control', description: 'Remove weeds that can harbor bacteria' }
            ]
        },
        severity: 'high',
        commonIn: 'monsoon'
    },
    
    // Wheat Diseases
    {
        name: 'Wheat Rust',
        scientificName: 'Puccinia triticina',
        plant: null,
        symptoms: [],
        description: 'A fungal disease causing orange-brown pustules on leaves and stems',
        cause: 'Fungus Puccinia triticina, spreads rapidly in warm, humid conditions',
        preventiveMeasures: [
            'Plant resistant varieties',
            'Remove volunteer wheat plants',
            'Avoid excessive nitrogen',
            'Proper crop rotation'
        ],
        treatment: {
            chemical: [
                { name: 'Propiconazole', dosage: 'As per label', application: 'Apply at first sign of rust' },
                { name: 'Tebuconazole', dosage: 'As per label', application: 'Systemic fungicide spray' }
            ],
            organic: [
                { method: 'Sulfur Dusting', instructions: 'Apply elemental sulfur as preventive measure' },
                { method: 'Remove Alternate Hosts', instructions: 'Remove volunteer wheat and barley' }
            ],
            cultural: [
                { practice: 'Early Sowing', description: 'Plant early to avoid peak disease period' },
                { practice: 'Balanced Fertilization', description: 'Avoid excessive nitrogen application' }
            ]
        },
        severity: 'high',
        commonIn: 'spring'
    },
    
    // Chili Diseases
    {
        name: 'Chili Leaf Curl',
        scientificName: 'Begomovirus',
        plant: null,
        symptoms: [],
        description: 'A viral disease causing severe curling and yellowing of leaves',
        cause: 'Begomovirus transmitted by whiteflies (Bemisia tabaci)',
        preventiveMeasures: [
            'Control whitefly population',
            'Remove infected plants',
            'Use virus-free seedlings',
            'Avoid planting near infected crops'
        ],
        treatment: {
            chemical: [
                { name: 'Imidacloprid', dosage: 'As per label', application: 'Apply to control whiteflies' }
            ],
            organic: [
                { method: 'Yellow Sticky Traps', instructions: 'Install yellow traps to monitor and trap whiteflies' },
                { method: 'Neem Oil Spray', instructions: 'Spray neem oil to control whiteflies' }
            ],
            cultural: [
                { practice: 'Barrier Crops', description: 'Plant barrier crops around chili field' },
                { practice: 'Rogueing', description: 'Remove infected plants immediately' }
            ]
        },
        severity: 'high',
        commonIn: 'summer'
    }
];

/**
 * Function to populate database with seed data
 * This function creates plants, symptoms, and diseases with proper relationships
 */
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');
        
        // Clear existing data
        await Plant.deleteMany({});
        await Symptom.deleteMany({});
        await Disease.deleteMany({});
        console.log('✅ Cleared existing data\n');
        
        // Insert plants
        const createdPlants = await Plant.insertMany(plantData);
        console.log(`✅ Created ${createdPlants.length} plants\n`);
        
        // Insert symptoms
        const createdSymptoms = await Symptom.insertMany(symptomData);
        console.log(`✅ Created ${createdSymptoms.length} symptoms\n`);
        
        // Create disease-symptom mappings
        const symptomMap = createdSymptoms.reduce((map, symptom) => {
            map[symptom.name] = symptom._id;
            return map;
        }, {});
        
        const plantMap = createdPlants.reduce((map, plant) => {
            map[plant.name] = plant._id;
            return map;
        }, {});
        
        // Update disease data with proper plant and symptom references
        const updatedDiseaseData = diseaseData.map(disease => {
            let plantName, symptomNames;
            
            switch(disease.name) {
                case 'Early Blight':
                    plantName = 'Tomato';
                    symptomNames = ['Brown leaf spots', 'Stem cankers', 'Fruit spots'];
                    break;
                case 'Late Blight':
                    plantName = 'Tomato';
                    symptomNames = ['Water-soaked spots on leaves', 'Stem rot', 'Fruit rot'];
                    break;
                case 'Bacterial Wilt':
                    plantName = 'Tomato';
                    symptomNames = ['Leaf wilting', 'Stunted growth', 'Root rot'];
                    break;
                case 'Potato Scab':
                    plantName = 'Potato';
                    symptomNames = ['Root rot', 'Stunted growth'];
                    break;
                case 'Black Scurf':
                    plantName = 'Potato';
                    symptomNames = ['Dark streaks on stem', 'Root rot'];
                    break;
                case 'Rice Blast':
                    plantName = 'Rice';
                    symptomNames = ['Brown leaf spots', 'Stem cankers', 'Stunted growth'];
                    break;
                case 'Bacterial Leaf Blight':
                    plantName = 'Rice';
                    symptomNames = ['Water-soaked spots on leaves', 'Leaf wilting', 'Stunted growth'];
                    break;
                case 'Wheat Rust':
                    plantName = 'Wheat';
                    symptomNames = ['Brown leaf spots', 'Leaf wilting', 'Stunted growth'];
                    break;
                case 'Chili Leaf Curl':
                    plantName = 'Chili';
                    symptomNames = ['Leaf curling', 'Yellowing of leaves', 'Stunted growth'];
                    break;
                default:
                    plantName = 'Tomato';
                    symptomNames = ['Yellowing of leaves'];
            }
            
            return {
                ...disease,
                plant: plantMap[plantName],
                symptoms: symptomNames.map(name => symptomMap[name]).filter(Boolean)
            };
        });
        
        // Insert diseases
        const createdDiseases = await Disease.insertMany(updatedDiseaseData);
        console.log(`✅ Created ${createdDiseases.length} diseases\n`);
        
        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   Plants: ${createdPlants.length}`);
        console.log(`   Symptoms: ${createdSymptoms.length}`);
        console.log(`   Diseases: ${createdDiseases.length}`);
        
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    // Connect to MongoDB (update connection string as needed)
    mongoose.connect('mongodb://localhost:27017/plant-disease-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('🔗 Connected to MongoDB\n');
        return seedDatabase();
    })
    .then(() => {
        mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    })
    .catch(error => {
        console.error('❌ Connection error:', error.message);
        process.exit(1);
    });
}

module.exports = { seedDatabase, plantData, symptomData, diseaseData };