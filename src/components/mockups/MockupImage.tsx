import { Camera, MapPin } from 'lucide-react';

export default function MockupImage({ title = "GPS Image", withPin = true }: { title?: string, withPin?: boolean }) {
  return (
    <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Background patterned grid representing construction blueprint */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
      
      {withPin ? (
        <MapPin className="w-8 h-8 text-brand opacity-50 mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
      ) : (
        <Camera className="w-8 h-8 text-slate-500 opacity-50 mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
      )}
      
      {/* Simulated Image Stamp */}
      <div className="absolute bottom-1 right-1 left-1 bg-slate-900/80 p-1.5 rounded text-[7px] leading-tight text-white border border-slate-700/50 backdrop-blur-sm">
         <div className="text-brand font-bold">{title}</div>
         <div className="text-slate-400">24.7136° N, 46.6753° E</div>
         <div className="text-slate-500 font-mono scale-[0.9] origin-left">2026-05-22 14:30</div>
      </div>
    </div>
  );
}
