import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { useCart, getSimulatedPrice } from '../context/CartContext';

// Helper to determine simulated campus merchant based on strArea
export const getCanteenByArea = (area) => {
  const normArea = area ? area.trim() : '';
  if (['Italian', 'French', 'American'].includes(normArea)) {
    return { id: 'kantin-bunda-arxel', name: 'Kantin Bunda Arxel' };
  }
  if (['Indonesian', 'Malaysian'].includes(normArea)) {
    return { id: 'kantin-emak', name: 'Kantin Emak' };
  }
  if (['Japanese', 'Chinese', 'Thai'].includes(normArea)) {
    return { id: 'kantin-khd', name: 'Kantin Rasa KHD' };
  }
  return { id: 'kantin-gsg', name: 'Kantin Samping GSG' };
};

export default function FoodCard({ meal }) {
  const { addToCart } = useCart();
  
  // Format price
  const price = getSimulatedPrice(meal.idMeal, meal.strMeal);
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  const rating = (4.2 + (parseInt(meal.idMeal) % 8) * 0.1).toFixed(1);
  const canteen = getCanteenByArea(meal.strArea);

  return (
    <article className="glass-card flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden group">
      {/* Food Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Hover overlay link to detail */}
        <Link 
          to={`/detail/${meal.idMeal}`} 
          className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        />
      </div>

      {/* Info Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/detail/${meal.idMeal}`} className="hover:text-blue-600 transition-colors">
          <h3 className="font-bold text-slate-900 text-xs sm:text-base leading-tight tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
            {meal.strMeal}
          </h3>
        </Link>

        {/* Merchant and Rating */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs mt-1 mb-2.5 sm:mb-3">
          <Link
            to={`/restaurant/${canteen.id}`}
            className="flex items-center gap-0.5 sm:gap-1 text-slate-505 hover:text-blue-650 transition-colors font-bold min-w-0 flex-1 mr-1.5 sm:mr-2"
          >
            <MapPin className="w-3 sm:h-3.5 sm:w-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{canteen.name}</span>
          </Link>
          <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
            <Star className="w-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-black">{rating}</span>
          </div>
        </div>

        {/* Price Tag */}
        <div className="text-slate-900 font-extrabold text-xs sm:text-sm">
          {formattedPrice}
        </div>

        {/* Full-width "Pesan Sekarang" solid blue button */}
        <button
          onClick={() => addToCart(meal)}
          className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 active:scale-[0.98] shadow shadow-blue-500/10 flex items-center justify-center gap-1.5"
        >
          <span>Pesan Sekarang</span>
        </button>
      </div>
    </article>
  );
}
