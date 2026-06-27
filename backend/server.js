import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so frontend on port 5173 can access the API
app.use(cors());
app.use(express.json());

// In-memory simple database for orders (in case they want to review later)
const orders = [];

// Database Kantin Kampus Kustom
const RESTAURANTS = [
  {
    id: 'kantin-bunda-arxel',
    name: 'Kantin Bunda Arxel',
    location: 'Belakang Gedung QB',
    areas: ['Italian', 'French', 'American'],
    description: 'Menyajikan pasta lezat, hidangan barat panggang, burger premium, dan pastry buatan Bunda Arxel.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60',
    rating: 4.8
  },
  {
    id: 'kantin-emak',
    name: 'Kantin Emak',
    location: 'Belakang Gedung QB',
    areas: ['Indonesian', 'Malaysian'],
    description: 'Menu legendaris masakan rumahan khas Emak mulai dari nasi rames hangat, soto gurih, hingga sambal lalapan.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60',
    rating: 4.7
  },
  {
    id: 'kantin-khd',
    name: 'Kantin Rasa KHD',
    location: 'Depan Gedung KHD',
    areas: ['Japanese', 'Chinese', 'Thai'],
    description: 'Spesialis kuliner Asia dengan menu mie ramen hangat, dimsum kukus, tumisan wok pan, dan sup asam pedas.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60',
    rating: 4.6
  },
  {
    id: 'kantin-gsg',
    name: 'Kantin Samping GSG',
    location: 'Samping Gedung GSG',
    areas: ['Turkish', 'Moroccan', 'Mexican', 'Spanish', 'Indian'],
    description: 'Pusat kuliner serba ada di samping GSG. Menyajikan kebab renyah, taco, quesadilla, dan kari kaya rempah.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
    rating: 4.5
  }
];

// Helper to proxy request to TheMealDB API
async function fetchFromMealDB(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('MealDB API response error');
  }
  return await response.json();
}

// Cache for all canteen meals
let cachedAllMeals = null;
let cacheTime = 0;

async function getAllCanteenMeals() {
  const now = Date.now();
  // Cache for 15 minutes
  if (cachedAllMeals && (now - cacheTime < 15 * 60 * 1000)) {
    return cachedAllMeals;
  }

  // Get unique areas from all canteens
  const allAreas = Array.from(new Set(RESTAURANTS.flatMap(r => r.areas)));

  const promises = allAreas.map(async (area) => {
    try {
      const data = await fetchFromMealDB(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`);
      if (data && data.meals) {
        return data.meals.map(meal => ({
          ...meal,
          strArea: area,
          strCategory: 'Khas ' + area
        }));
      }
    } catch (err) {
      console.error(`Error loading meals for area ${area}:`, err);
    }
    return [];
  });

  const results = await Promise.all(promises);
  let merged = results.flat();

  // Deduplicate meals
  const seen = new Set();
  merged = merged.filter(meal => {
    if (seen.has(meal.idMeal)) return false;
    seen.add(meal.idMeal);
    return true;
  });

  cachedAllMeals = merged;
  cacheTime = now;
  return merged;
}

// 1. Endpoint GET: Daftar & Pencarian Makanan
// GET /api/meals?s={kata_kunci}
app.get('/api/meals', async (req, res) => {
  const query = (req.query.s || '').toLowerCase().trim();
  
  try {
    const meals = await getAllCanteenMeals();
    if (query) {
      const filtered = meals.filter(meal => 
        meal.strMeal.toLowerCase().includes(query) || 
        (meal.strCategory && meal.strCategory.toLowerCase().includes(query)) ||
        (meal.strArea && meal.strArea.toLowerCase().includes(query))
      );
      return res.json({ meals: filtered });
    }
    res.json({ meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals from canteens' });
  }
});

// 2. Endpoint GET: Informasi Detail Kuliner berdasarkan ID
// GET /api/meals/:id
app.get('/api/meals/:id', async (req, res) => {
  const { id } = req.params;
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  
  try {
    const data = await fetchFromMealDB(url);
    if (data && data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      if (meal.strInstructions) {
        try {
          // Translate instructions to Indonesian using free MyMemory API
          const transUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(meal.strInstructions)}&langpair=en|id&de=carimakan.campus@gmail.com`;
          const transRes = await fetch(transUrl);
          if (transRes.ok) {
            const transData = await transRes.json();
            meal.strInstructionsID = transData.responseData.translatedText || '';
          }
        } catch (transErr) {
          console.error('Translation failed, returning original instructions:', transErr);
          meal.strInstructionsID = '';
        }
      }
    }
    res.json(data);
  } catch (error) {
    console.error(`Error fetching meal ${id}:`, error);
    res.status(500).json({ error: `Failed to fetch meal detail for ID ${id}` });
  }
});

// Daftar Mahasiswa
const STUDENTS = [
  { npm: '24781001', nama: 'Abdur Rouf Hanafi' },
  { npm: '24781002', nama: 'Ahmad Rizky Maulana' },
  { npm: '24781003', nama: 'Alzahra Dwi Febriyan' },
  { npm: '24781004', nama: 'Atta Zaky Ramadhan' },
  { npm: '24781005', nama: 'Bunga Putri Salsabilla' },
  { npm: '24781006', nama: 'Dafa Anggara Yonata' },
  { npm: '24781007', nama: 'Deni Prawira' },
  { npm: '24781008', nama: 'Dona Virza' },
  { npm: '24781009', nama: 'Fahmi Ghozali' },
  { npm: '24781010', nama: 'Farhan Habibullah' },
  { npm: '24781011', nama: 'Fitri Amelia Ananti' },
  { npm: '24781012', nama: 'Heidy Putri Shafira' },
  { npm: '24781013', nama: 'Jesfitrina Sihombing' },
  { npm: '24781014', nama: 'Lia Agustina' },
  { npm: '24781015', nama: 'M. Rayhan Zulkarnain' },
  { npm: '24781016', nama: 'Muhammad Alwan Dzaky' },
  { npm: '24781017', nama: 'Nabila Alfi Nur Khasanah' },
  { npm: '24781018', nama: 'Nadiya Ghefira El Firsi' },
  { npm: '24781019', nama: 'Nayla Putri Syafira Arrovi' },
  { npm: '24781020', nama: 'Nyken Sekar Ayuningtyas' },
  { npm: '24781021', nama: 'Rafi Diandra Ardi Agusta' },
  { npm: '24781022', nama: 'Rendy Dwi Prayoga' },
  { npm: '24781023', nama: 'Rifki Rangga Saputra' },
  { npm: '24781024', nama: 'Rizki Surohman' },
  { npm: '24781025', nama: 'Rubby Ibnu Anantara' },
  { npm: '24781026', nama: 'Septi Cahyaningtias' },
  { npm: '24781027', nama: 'Sofi Ramadhani' },
  { npm: '24781028', nama: 'Tasya Rismala' },
  { npm: '24781029', nama: 'Ulfa Setyaningsih' },
  { npm: '24781030', nama: 'Yoga Ricky Pasaribu' },
  { npm: '24781031', nama: 'Yusuf Al Fikri Jayasena' }
];

// 3. Endpoint POST: Login Mahasiswa menggunakan Nama dan NPM
// POST /api/login
// Body: { nama: string, npm: string }
app.post('/api/login', (req, res) => {
  const { nama, npm } = req.body;
  
  if (!nama || !npm) {
    return res.status(400).json({ error: 'Nama dan NPM wajib diisi' });
  }

  // Cari mahasiswa berdasarkan NPM dan Nama (case-insensitive)
  const student = STUDENTS.find(s => 
    s.npm === npm.trim() && 
    s.nama.toLowerCase() === nama.trim().toLowerCase()
  );

  if (!student) {
    return res.status(401).json({ error: 'Nama atau NPM tidak terdaftar' });
  }

  // Simulate returning the student profile with initial balance
  res.json({
    nama: student.nama,
    npm: student.npm,
    balance: 100000 // Rp 100.000 starting balance
  });
});

// 4. Endpoint POST: Simulasi Checkout Pesanan
// POST /api/orders
// Body: { npm: string, nim: string, items: Array, paymentMethod: string, total: number }
app.post('/api/orders', (req, res) => {
  const { npm, nim, items, paymentMethod, total } = req.body;

  if (!items || items.length === 0 || !paymentMethod || total === undefined) {
    return res.status(400).json({ error: 'Keranjang belanja kosong atau metode pembayaran tidak valid' });
  }

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId,
    npm: npm || nim || 'Guest',
    items,
    paymentMethod,
    total,
    status: 'Diproses',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  // If KantinPay, simulate verifying/deducting on server side
  res.status(201).json({
    message: 'Pesanan berhasil dibuat',
    order: newOrder
  });
});

// RESTAURANTS is defined at the top of the file

// 5. Endpoint GET: Daftar Kantin/Restoran
app.get('/api/restaurants', (req, res) => {
  res.json(RESTAURANTS);
});

// 6. Endpoint GET: Detail Profil Kantin
app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Kantin tidak ditemukan' });
  }
  res.json(restaurant);
});

// 7. Endpoint GET: Daftar Menu Kantin Dinamik
app.get('/api/restaurants/:id/meals', async (req, res) => {
  const { id } = req.params;
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Kantin tidak ditemukan' });
  }

  try {
    const promises = restaurant.areas.map((area) =>
      fetchFromMealDB(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`)
    );
    const results = await Promise.all(promises);
    
    let mergedMeals = [];
    results.forEach((data, index) => {
      if (data && data.meals) {
        const areaName = restaurant.areas[index];
        const taggedMeals = data.meals.map((meal) => ({
          ...meal,
          strArea: areaName,
          strCategory: 'Khas ' + areaName
        }));
        mergedMeals = mergedMeals.concat(taggedMeals);
      }
    });

    res.json({ meals: mergedMeals });
  } catch (error) {
    console.error(`Error fetching meals for restaurant ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch canteen menu from external API' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[CariMakan API Server] Running on http://localhost:${PORT}`);
});
