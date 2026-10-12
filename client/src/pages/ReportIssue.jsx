import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  FileText,
  Search,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCatCode = searchParams.get('cat');

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

  // Success Confirmation State
  const [submittedIssue, setSubmittedIssue] = useState(null);

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
          
          if (preselectedCatCode) {
            const matched = res.data.data.find(
              (c) => c.code.toLowerCase() === preselectedCatCode.toLowerCase()
            );
            if (matched) {
              setCategoryId(matched._id);
              return;
            }
          }

          if (res.data.data.length > 0) {
            setCategoryId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, [preselectedCatCode]);

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
        setSubmittedIssue(res.data.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit report. Please check details.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully submitted, render Confirmation Screen
  if (submittedIssue) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#218653] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-[#15171D]">
              Complaint Registered Successfully!
            </h1>
            <p className="text-xs text-[#64748B]">
              Your grievance has been submitted to PCMC municipal staff for immediate verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-500 uppercase">Complaint Reference ID:</span>
              <strong className="font-mono text-[#245D9C] text-sm bg-blue-50 px-2 py-0.5 rounded">
                {submittedIssue._id}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issue Title:</span>
              <span className="font-bold text-slate-900">{submittedIssue.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-800">{submittedIssue.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ward:</span>
              <span className="font-semibold text-slate-800">
                {submittedIssue.ward ? `Ward ${submittedIssue.ward.number} (${submittedIssue.ward.name})` : 'PCMC Area'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-[#B79A68]">{submittedIssue.category?.department}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/track?id=${submittedIssue._id}`}
              className="flex-1 py-3 px-4 bg-[#245D9C] hover:bg-[#1a4778] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-1.5" />
              Track Complaint Progress
            </Link>

            <button
              onClick={() => {
                setSubmittedIssue(null);
                setStep(1);
                setSelectedFiles([]);
                setPreviewUrls([]);
                setTitle('');
                setDescription('');
                setAddress('');
              }}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-[#15171D] text-xs font-bold rounded-xl transition"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Stepper Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B79A68]">
          Grievance Submission Form
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15171D] mt-1">
          Report a Civic Issue
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Provide photographs and drop a map pin in PCMC. Ward boundaries are automatically recognized.
        </p>

        <div className="flex items-center space-x-3 mt-6">
          <div
            className={`flex items-center text-xs font-bold ${
              step >= 1 ? 'text-[#245D9C]' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 1 ? 'bg-[#245D9C] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            Photos ({selectedFiles.length}/3)
          </div>
          <div className="h-0.5 w-10 sm:w-16 bg-slate-200"></div>
          <div
            className={`flex items-center text-xs font-bold ${
              step >= 2 ? 'text-[#245D9C]' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 2 ? 'bg-[#245D9C] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            Map Location
          </div>
          <div className="h-0.5 w-10 sm:w-16 bg-slate-200"></div>
          <div
            className={`flex items-center text-xs font-bold ${
              step >= 3 ? 'text-[#245D9C]' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 3 ? 'bg-[#245D9C] text-white' : 'bg-slate-200 text-slate-600'
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
          <div>
            <h2 className="text-base font-bold text-[#15171D] flex items-center">
              <Upload className="w-5 h-5 mr-2 text-[#245D9C]" /> Step 1: Upload Proof Photos
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Attach up to 3 photos (JPEG, PNG or WebP, max 5 MB each) clearly displaying the damage or hazard.
            </p>
          </div>

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
              <label className="h-44 border-2 border-dashed border-slate-300 rounded-xl hover:border-[#245D9C] flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-[#e9f1fa]/40 transition p-4 text-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">
                  Select Photo / Open Camera
                </span>
                <span className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WebP (Max 5MB)</span>
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
              className="px-6 py-2.5 bg-[#245D9C] hover:bg-[#1a4778] text-white font-bold text-sm rounded-xl transition shadow-sm"
            >
              Continue to Location &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Drop Map Pin */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#15171D] flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#245D9C]" /> Step 2: Pin Location on Map
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Click anywhere within PCMC limits to set the exact geographic coordinates.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-[#245D9C] bg-[#e9f1fa] hover:bg-blue-100 rounded-lg border border-[#245D9C]/20"
            >
              <LocateFixed className="w-4 h-4 mr-1.5 text-[#245D9C]" />
              Use My Device GPS
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
            <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
              <span>
                Coordinates: <strong>{selectedPoint[1].toFixed(5)}, {selectedPoint[0].toFixed(5)}</strong>
              </span>
              <span className="text-[#218653] font-bold">✓ Inside PCMC Boundaries</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-[#245D9C] hover:bg-[#1a4778] text-white font-bold text-sm rounded-xl transition shadow-sm"
            >
              Continue to Details &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details & Duplicate Warning */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#15171D] flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#245D9C]" /> Step 3: Category & Description
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Provide necessary details so the ward department can act effectively.
            </p>
          </div>

          {/* Duplicate Warning Alert */}
          {nearbyDuplicates.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                Nearby Active Duplicate Warning (Within 100 meters)
              </div>
              <p className="text-xs text-amber-800">
                A similar open issue exists nearby. Upvoting it helps escalate priority without duplicate paperwork.
              </p>
              <div className="space-y-2">
                {nearbyDuplicates.map((dup) => (
                  <div
                    key={dup._id}
                    className="p-3 bg-white rounded-lg border border-amber-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{dup.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Status: <strong className="capitalize">{dup.status}</strong> • {dup.upvoteCount} upvotes
                      </div>
                    </div>
                    <Link
                      to={`/issues/${dup._id}`}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md flex items-center"
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" /> Upvote Instead
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Civic Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#245D9C] bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — (Dept: {c.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Major sewage overflow blocking road opposite Bus Stand"
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#245D9C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Landmark / Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Sai Chowk, Thergaon Link Road"
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#245D9C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the severity, duration, and safety hazards..."
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#245D9C]"
              />
            </div>

            {/* Citizen Consent & Privacy statement */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#245D9C] flex-shrink-0 mt-0.5" />
              <span>
                By submitting this complaint, you consent to sharing the photograph and approximate location publicly to assist PCMC staff in triage. Your private contact details are kept secure.
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
            >
              &larr; Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#245D9C] hover:bg-[#1a4778] text-white font-bold text-sm rounded-xl transition shadow disabled:opacity-50"
            >
              {submitting ? 'Submitting to PCMC...' : 'Submit Civic Complaint'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
