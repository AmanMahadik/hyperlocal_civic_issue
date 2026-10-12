require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Category = require('../models/Category');
const Ward = require('../models/Ward');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');

const categoriesData = require('./categoriesData');
const wardsData = require('./wardsData');

const seedDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://localhost:27017/civic_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { family: 4, serverSelectionTimeoutMS: 5000 });

    console.log('Cleaning existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Ward.deleteMany({}),
      Issue.deleteMany({}),
      Comment.deleteMany({})
    ]);

    console.log('1. Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✓ Inserted ${createdCategories.length} categories.`);

    console.log('2. Seeding PCMC Wards...');
    const createdWards = await Ward.insertMany(wardsData);
    console.log(`✓ Inserted ${createdWards.length} PCMC wards.`);

    console.log('3. Seeding Admin and Citizen Users...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const citizenPasswordHash = await bcrypt.hash('citizen123', salt);

    const admin = await User.create({
      name: 'PCMC Admin Officer',
      email: 'admin@pcmc.gov.in',
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '020-67333333',
      isActive: true
    });

    const citizen = await User.create({
      name: 'Rohan Deshmukh',
      email: 'citizen@example.com',
      passwordHash: citizenPasswordHash,
      role: 'citizen',
      phone: '9876543210',
      isActive: true
    });

    console.log(`✓ Users created:`);
    console.log(`   Admin: admin@pcmc.gov.in / admin123`);
    console.log(`   Citizen: citizen@example.com / citizen123`);

    console.log('4. Seeding Sample PCMC Issues...');
    const garbageCat = createdCategories.find((c) => c.code === 'GARBAGE');
    const roadCat = createdCategories.find((c) => c.code === 'ROAD');
    const drainageCat = createdCategories.find((c) => c.code === 'DRAINAGE');
    const lightCat = createdCategories.find((c) => c.code === 'STREETLIGHT');

    const sampleIssues = [
      {
        title: 'Massive Garbage Heap near Pimpri Market',
        description:
          'Garbage overflowing from roadside bins onto the road causing foul odor and blocking pedestrians near Sai Chowk.',
        category: garbageCat._id,
        reporter: citizen._id,
        ward: createdWards[3]._id, // Ward 4: Pimpri
        location: {
          type: 'Point',
          coordinates: [73.805, 18.625]
        },
        address: 'Sai Chowk, Main Market, Pimpri Colony, Pune 411017',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800',
            publicId: 'sample_garbage_1'
          }
        ],
        status: 'pending',
        priority: 'high',
        upvotes: [citizen._id],
        upvoteCount: 1,
        statusHistory: [
          {
            status: 'pending',
            changedBy: citizen._id,
            note: 'Reported by citizen with photo',
            at: new Date(Date.now() - 4 * 3600 * 1000)
          }
        ]
      },
      {
        title: 'Dangerous Potholes on Spine Road near Akurdi',
        description:
          'Deep potholes right after the flyover ramp. Two-wheelers frequently losing balance during peak hours.',
        category: roadCat._id,
        reporter: citizen._id,
        ward: createdWards[1]._id, // Ward 2: Akurdi
        location: {
          type: 'Point',
          coordinates: [73.765, 18.648]
        },
        address: 'Spine Road, Near D Mart Junction, Akurdi',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800',
            publicId: 'sample_road_1'
          }
        ],
        status: 'verified',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000),
        upvotes: [citizen._id],
        upvoteCount: 6,
        statusHistory: [
          {
            status: 'pending',
            changedBy: citizen._id,
            note: 'Reported by citizen',
            at: new Date(Date.now() - 24 * 3600 * 1000)
          },
          {
            status: 'verified',
            changedBy: admin._id,
            note: 'Verified: Road dept priority action scheduled',
            at: new Date(Date.now() - 18 * 3600 * 1000)
          }
        ]
      },
      {
        title: 'Stormwater Drainage Overflow at Wakad Chowk',
        description:
          'Dirty water stagnation and open drain overflowing after rain. High risk of mosquito breeding and traffic disruption.',
        category: drainageCat._id,
        reporter: citizen._id,
        ward: createdWards[6]._id, // Ward 7: Wakad
        location: {
          type: 'Point',
          coordinates: [73.762, 18.598]
        },
        address: 'Near Datta Mandir Road, Wakad',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800',
            publicId: 'sample_drainage_1'
          }
        ],
        status: 'in_progress',
        priority: 'critical',
        assignedTo: admin._id,
        dueDate: new Date(Date.now() + 1 * 24 * 3600 * 1000),
        upvotes: [citizen._id, admin._id],
        upvoteCount: 16,
        statusHistory: [
          {
            status: 'pending',
            changedBy: citizen._id,
            note: 'Reported by citizen',
            at: new Date(Date.now() - 48 * 3600 * 1000)
          },
          {
            status: 'verified',
            changedBy: admin._id,
            note: 'Verified by Ward Officer',
            at: new Date(Date.now() - 36 * 3600 * 1000)
          },
          {
            status: 'assigned',
            changedBy: admin._id,
            note: 'Assigned to Drainage Wing Team 3',
            at: new Date(Date.now() - 24 * 3600 * 1000)
          },
          {
            status: 'in_progress',
            changedBy: admin._id,
            note: 'Suction tanker deployed on site',
            at: new Date(Date.now() - 6 * 3600 * 1000)
          }
        ]
      },
      {
        title: 'Non-functional Streetlights along Sangvi River Road',
        description:
          'Entire stretch of 6 consecutive poles has been dark for the past 5 nights.',
        category: lightCat._id,
        reporter: citizen._id,
        ward: createdWards[5]._id, // Ward 6: Sangvi
        location: {
          type: 'Point',
          coordinates: [73.815, 18.588]
        },
        address: 'Old Sangvi River View Promenade',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800',
            publicId: 'sample_lights_1'
          }
        ],
        status: 'resolved',
        priority: 'medium',
        resolvedAt: new Date(Date.now() - 2 * 3600 * 1000),
        resolutionImages: [
          {
            url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800',
            publicId: 'sample_lights_resolved'
          }
        ],
        upvotes: [],
        upvoteCount: 0,
        statusHistory: [
          {
            status: 'pending',
            changedBy: citizen._id,
            note: 'Reported by citizen',
            at: new Date(Date.now() - 30 * 3600 * 1000)
          },
          {
            status: 'verified',
            changedBy: admin._id,
            note: 'Verified with Electrical Dept',
            at: new Date(Date.now() - 20 * 3600 * 1000)
          },
          {
            status: 'in_progress',
            changedBy: admin._id,
            note: 'Cable repair team dispatched',
            at: new Date(Date.now() - 10 * 3600 * 1000)
          },
          {
            status: 'resolved',
            changedBy: admin._id,
            note: 'Faulty feeder replaced, all lights operational',
            at: new Date(Date.now() - 2 * 3600 * 1000)
          }
        ]
      }
    ];

    await Issue.insertMany(sampleIssues);
    console.log(`✓ Inserted ${sampleIssues.length} sample civic issues.`);

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
