import React, { useState, useEffect, useRef } from 'react';

/**
 * BarcodeScannerModal Component - สแกนบาร์โค้ดด้วยกล้องมือถือ (EAN-13, EAN-8, UPC, QR)
 */
export function BarcodeScannerModal({ isOpen, onClose, onScanSuccess }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg('');
    setScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('เบราว์เซอร์ไม่รองรับการเปิดกล้อง');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } }
      }).catch(async () => {
        // Fallback to any camera if environment camera is not available
        return await navigator.mediaDevices.getUserMedia({ video: true });
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for BarcodeDetector API
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'code_128', 'qr_code', 'upc_a', 'upc_e']
        });

        const detectLoop = async () => {
          if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
            if (isOpen) requestAnimationFrame(detectLoop);
            return;
          }

          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              triggerBeepAndHaptic();
              onScanSuccess(code);
              stopCamera();
              return;
            }
          } catch (err) {
            console.error('Barcode detection error:', err);
          }

          if (isOpen) requestAnimationFrame(detectLoop);
        };

        requestAnimationFrame(detectLoop);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตสิทธิ์การใช้กล้องในเบราว์เซอร์');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    setScanning(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const triggerBeepAndHaptic = () => {
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    triggerBeepAndHaptic();
    onScanSuccess(manualCode.trim());
    stopCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="glass-card bg-white border border-stone-200 p-5 rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl max-h-[95vh] overflow-y-auto pb-safe">
        <div className="flex justify-between items-center mb-3 border-b border-stone-100 pb-2.5">
          <h3 className="font-heading font-bold text-base text-stone-900 flex items-center gap-2">
            <i className="fa-solid fa-barcode text-emerald-600"></i>
            <span>สแกนบาร์โค้ดสินค้า</span>
          </h3>
          <button onClick={() => { stopCamera(); onClose(); }} className="text-stone-400 hover:text-stone-800 text-lg p-1">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {errorMsg ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs text-center space-y-2">
            <i className="fa-solid fa-triangle-exclamation text-xl"></i>
            <p>{errorMsg}</p>
          </div>
        ) : (
          <div className="relative w-full aspect-square bg-stone-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            
            {/* Viewfinder frame overlay */}
            <div className="absolute inset-0 border-[40px] border-stone-900/60 pointer-events-none flex items-center justify-center">
              <div className="w-full h-40 border-2 border-emerald-500 rounded-xl relative shadow-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
                
                {/* Laser animation */}
                <div className="w-full h-0.5 bg-emerald-400 shadow-md shadow-emerald-400/80 absolute top-1/2 -translate-y-1/2 animate-pulse"></div>
              </div>
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
              <span className="bg-stone-900/80 text-white text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                วางบาร์โค้ดให้อยู่ในกรอบสีเขียว
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
          <div className="text-xs text-stone-500 text-center font-medium">หรือกรอกรหัสบาร์โค้ดเอง:</div>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input 
              type="text" 
              placeholder="เช่น 8850001234567"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-emerald-500"
            />
            <button 
              type="submit"
              className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
            >
              ค้นหา
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
