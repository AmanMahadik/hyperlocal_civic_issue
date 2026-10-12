import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import {
  Upload,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  LocateFixed,
  X,
  ThumbsUp,
  FileText
} from 'lucide-react';

export default function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1); // 1: Photos, 2: Location, 3: Details & Submit

  // Form states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState([73.805, 18.625]); // Default Pimpri [lng, lat]
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [address, setAddress] = useState('');

  // Duplicates & Loading
  const [nearbyDuplicates, setNearbyDuplicates] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setCategoryId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Check for nearby duplicates when location or category changes
  useEffect(() => {
    const checkDuplicates = async () => {
      if (!selectedPoint || !categoryId) return;
      setCheckingDuplicates(true);
      try {
        const res = await api.get('/issues/nearby', {
          params: {
            lng: selectedPoint[0],
            lat: selectedPoint[1],
            radius: 100, // 100 meters
            categoryId
          }
        });
        if (res.data.success) {
          setNearbyDuplicates(res.data.data);
        }
      } catch (err) {
        console.error('Duplicate check error:', err);
      } finally {
        setCheckingDuplicates(false);
      }
    };

    const timeout = setTimeout(checkDuplicates, 500);
    return () => clearTimeout(timeout);
  }, [selectedPoint, categoryId]);

  // Handle Photo selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 3) {
      alert('You can upload a maximum of 3 photos.');
      return;
    }

    const newFiles = [...selectedFiles, ...files].slice(0, 3);
    setSelectedFiles(newFiles);

    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Device GPS Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedPoint([pos.coords.longitude, pos.coords.latitude]);
      },
      (err) => {
        alert('Could not retrieve your location. Please drop a pin manually on the map.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId);
      formData.append('address', address);
      formData.append('coordinates', JSON.stringify(selectedPoint));

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        navigate(`/issues/${res.data.data._id}`);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit report. Please check details.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Stepper Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Report a Civic Issue</h1>
        <p className="text-sm text-slate-500 mt-1">
          Take a photo, drop a pin in PCMC, and submit to the responsible department.
        </p>

        <div className="flex items-center space-x-4 mt-6">
          <div
            className={`flex items-center text-xs font-semibold ${
              step >= 1 ? 'text-pcmc-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 1 ? 'bg-pcmc-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            Photos ({selectedFiles.length}/3)
          </div>
          <div className="h-0.5 w-12 bg-slate-200"></div>
          <div
            className={`flex items-center text-xs font-semibold ${
              step >= 2 ? 'text-pcmc-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 2 ? 'bg-pcmc-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            Map Location
          </div>
          <div className="h-0.5 w-12 bg-slate-200"></div>
          <div
            className={`flex items-center text-xs font-semibold ${
              step >= 3 ? 'text-pcmc-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 3 ? 'bg-pcmc-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            Details & Submit
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Upload Photos */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-pcmc-600" /> Step 1: Upload Proof Photos
          </h2>
          <p className="text-xs text-slate-500">
            Upload up to 3 photos of the problem (pothole, garbage pile, water leakage, etc.).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative h-44 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
              >
                <img src={url} alt="Proof" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {selectedFiles.length < 3 && (
              <label className="h-44 border-2 border-dashed border-slate-300 rounded-xl hover:border-pcmc-500 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-pcmc-50/30 transition p-4 text-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  Select Photo / Camera
                </span>
                <span className="text-[10px] text-slate-400 mt-1">JPEG, PNG or WebP</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                if (selectedFiles.length === 0) {
                  alert('Please upload at least 1 photo showing the civic problem.');
                  return;
                }
                setStep(2);
              }}
              className="px-5 py-2.5 bg-pcmc-600 hover:bg-pcmc-700 text-white font-medium text-sm rounded-lg transition"
            >
              Continue to Location &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Drop Map Pin */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-pcmc-600" /> Step 2: Pin Location on Map
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Click anywhere on the PCMC map to drop or reposition the pin.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-pcmc-700 bg-pcmc-50 hover:bg-pcmc-100 rounded-lg border border-pcmc-200"
            >
              <LocateFixed className="w-4 h-4 mr-1.5 text-pcmc-600" />
              Use My GPS
            </button>
          </div>

          <div className="space-y-2">
            <MapView
              selectedPoint={selectedPoint}
              onLocationSelect={(point) => setSelectedPoint(point)}
              center={[selectedPoint[1], selectedPoint[0]]}
              zoom={13}
              height="380px"
            />
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>
                Coordinates: <strong>{selectedPoint[1].toFixed(5)}, {selectedPoint[0].toFixed(5)}</strong>
              </span>
              <span className="text-pcmc-700 font-medium">Inside PCMC Corporation</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-pcmc-600 hover:bg-pcmc-700 text-white font-medium text-sm rounded-lg transition"
            >
              Continue to Details &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details & Duplicate Warning */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-pcmc-600" /> Step 3: Category & Description
          </h2>

          {/* Duplicate Warning Step */}
          {nearbyDuplicates.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center font-semibold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
                Nearby Duplicate Issue Warning
              </div>
              <p className="text-xs text-amber-800">
                A similar open issue has already been reported within 100 meters of this location. To help PCMC resolve issues faster without duplicate paperwork, you can upvote the existing report:
              </p>
              <div className="space-y-2">
                {nearbyDuplicates.map((dup) => (
                  <div
                    key={dup._id}
                    className="p-3 bg-white rounded-lg border border-amber-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{dup.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Status: <strong className="capitalize">{dup.status}</strong> • {dup.upvoteCount} upvotes
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/issues/${dup._id}`)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md flex items-center"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 mr-1" /> Upvote Instead
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Civic Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-pcmc-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} (Dept: {c.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken water pipe leaking continuously near Bus Stop"
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-pcmc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Landmark / Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Opposite Sai Baba Mandir, Thergaon link road"
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-pcmc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, how long it has been there, hazards to residents..."
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-pcmc-500"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50"
            >
              &larr; Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-pcmc-600 hover:bg-pcmc-700 text-white font-medium text-sm rounded-lg transition shadow disabled:opacity-50"
            >
              {submitting ? 'Submitting to PCMC...' : 'Submit Civic Issue'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
