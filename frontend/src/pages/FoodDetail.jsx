import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Play, Globe, Tag, MapPin } from 'lucide-react';
import { useCart, getSimulatedPrice } from '../context/CartContext';
import { getCanteenByArea } from '../components/FoodCard';

export default function FoodDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [langMode, setLangMode] = useState('ID');

  // Fetch meal details from local Express backend
  useEffect(() => {
    async function fetchMealDetail() {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(`/api/meals/${id}`);
        if (!response.ok) {
          throw new Error('Backend server detail error');
        }
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setMeal(data.meals[0]);
        } else {
          setMeal(null);
        }
      } catch (err) {
        setIsError(true);
        console.error('Fetch detail error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMealDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 md:px-8 space-y-8 bg-slate-50">
        <div className="h-6 w-24 skeleton-shimmer bg-white rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[4/3] skeleton-shimmer bg-white rounded-2xl border border-slate-100"></div>
          <div className="space-y-4">
            <div className="h-4 w-1/4 skeleton-shimmer bg-white rounded"></div>
            <div className="h-8 w-3/4 skeleton-shimmer bg-white rounded"></div>
            <div className="h-6 w-1/3 skeleton-shimmer bg-white rounded"></div>
            <div className="h-12 w-full skeleton-shimmer bg-white rounded-xl mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !meal) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border rounded-2xl shadow-sm mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Detail Makanan Tidak Ditemukan</h3>
        <p className="text-sm text-slate-500 mb-6 font-medium">
          Menu yang Anda cari tidak dapat dimuat atau telah dihapus.
        </p>
        <Link to="/" className="btn-primary inline-flex text-xs">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Parse ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        id: i,
        name: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  // Parse instructions dynamically based on language mode selection
  const currentInstructions = langMode === 'ID' && meal.strInstructionsID
    ? meal.strInstructionsID
    : meal.strInstructions;

  const instructionsSteps = currentInstructions
    ? currentInstructions
        .split(/(?:\r\n|\r|\n)+/g)
        .filter((step) => step.trim().length > 0)
    : [];

  const price = getSimulatedPrice(meal.idMeal, meal.strMeal);
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  const rating = (4.2 + (parseInt(meal.idMeal) % 8) * 0.1).toFixed(1);
  const canteen = getCanteenByArea(meal.strArea);

  // Extract YouTube ID
  let youtubeEmbedUrl = '';
  if (meal.strYoutube) {
    const ytIdMatch = meal.strYoutube.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    if (ytIdMatch && ytIdMatch[1]) {
      youtubeEmbedUrl = `https://www.youtube.com/embed/${ytIdMatch[1]}`;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 space-y-12">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-bold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Menu
      </Link>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Meal Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-md bg-white">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-sm border border-slate-100 text-[10px] font-bold text-blue-600 rounded-full shadow-sm">
              <Tag className="w-3.5 h-3.5" />
              {meal.strCategory}
            </span>
            {meal.strArea && (
              <span className="flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-sm border border-slate-100 text-[10px] font-bold text-indigo-600 rounded-full shadow-sm">
                <Globe className="w-3.5 h-3.5" />
                {meal.strArea}
              </span>
            )}
          </div>
        </div>

        {/* Right: Info details & actions */}
        <div className="space-y-6">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                to={`/restaurant/${canteen.id}`}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-650 font-bold transition-colors"
              >
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{canteen.name}</span>
              </Link>
              
              <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{rating}</span>
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {meal.strMeal}
            </h1>
          </div>

          {/* Pricing & Add to Cart Card */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-450 uppercase tracking-widest font-bold block mb-0.5">Harga Porsi</span>
                <span className="text-xl font-extrabold text-slate-900">{formattedPrice}</span>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Harga Mahasiswa</span>
            </div>

            <button
              onClick={() => addToCart(meal)}
              className="btn-primary w-full py-3 text-xs font-bold"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              Pesan Sekarang
            </button>
          </div>

          {/* Quick info badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-white border border-slate-100 rounded-xl text-center shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Kategori</span>
              <span className="text-xs font-bold text-blue-600">{meal.strCategory || 'Umum'}</span>
            </div>
            <div className="p-3.5 bg-white border border-slate-100 rounded-xl text-center shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Estimasi Saji</span>
              <span className="text-xs font-bold text-indigo-600">10-15 Menit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Ingredients vs Instructions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Ingredients List (1/3 width) */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900">
              Bahan & Komposisi
            </h2>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 text-xs text-slate-705 font-medium"
              >
                <span className="truncate pr-2">{ing.name}</span>
                <span className="font-bold text-slate-500 flex-shrink-0">{ing.measure}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Steps (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-bold text-sm text-slate-900">Petunjuk Penyajian</h2>
              
              {/* Language Selector tabs */}
              {meal.strInstructionsID && (
                <div className="flex border border-slate-200 rounded-lg overflow-hidden text-[10px] font-bold">
                  <button
                    onClick={() => setLangMode('ID')}
                    className={`px-2.5 py-1.5 transition-colors ${
                      langMode === 'ID'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => setLangMode('EN')}
                    className={`px-2.5 py-1.5 transition-colors ${
                      langMode === 'EN'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-5">
              {instructionsSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <p className="text-slate-650 text-xs leading-relaxed pt-1.5 select-text font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Video Section */}
          {youtubeEmbedUrl && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Play className="w-5 h-5 text-red-500 fill-red-500" />
                <h2 className="font-bold text-sm text-slate-900">Video Tutorial Resep</h2>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                <iframe
                  src={youtubeEmbedUrl}
                  title={`Video tutorial memasak ${meal.strMeal}`}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
