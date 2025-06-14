import React, { useState, useEffect } from 'react';
import { Shield, Send, Plus, X, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import LiveLocationMap from './LiveLocationMap'; // Adjust the path if needed

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Partial<Contact>>({});
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    return () => clearInterval(timer);
  }, []);

  const addContact = () => {
    if (newContact.name && newContact.phone && newContact.email) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() } as Contact]);
      setNewContact({});
      setShowForm(false);
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const sendSOS = async () => {
    if (!location) {
      alert('Location is still loading. Please wait a moment.');
      return;
    }

    const locationUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    const contactEmails = contacts.map(contact => contact.email).join(', ');

    for (const contact of contacts) {
      const templateParams = {
        user_name: contact.name,
        latitude: location.lat.toFixed(6),
        longitude: location.lng.toFixed(6),
        timestamp: currentTime,
        location_url: locationUrl,
        contact_emails: contactEmails,
        to_email: contact.email,
      };

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }

    alert('SOS alert sent to all contacts.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-rose-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Women's Safety App</h1>
          <p className="text-gray-600">Stay connected, stay safe</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Emergency Contacts</h2>
            {contacts.length < 4 && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center text-rose-600 hover:text-rose-700"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Contact
              </button>
            )}
          </div>

          {showForm && (
            <div className="mb-6 bg-rose-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name || ''}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone || ''}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newContact.email || ''}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addContact}
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                  >
                    Save Contact
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                </div>
                <button
                  onClick={() => removeContact(contact.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-rose-600" />
              <div>
                <p className="text-sm text-gray-600">Latitude</p>
                <p className="font-semibold">{location?.lat?.toFixed(6) || 'Loading...'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-rose-600" />
              <div>
                <p className="text-sm text-gray-600">Longitude</p>
                <p className="font-semibold">{location?.lng?.toFixed(6) || 'Loading...'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="font-semibold">{currentTime}</p>
            </div>
          </div>
        </div>

        {/* Wellbeing Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 ring-2 ring-pink-300 hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-2xl font-bold text-pink-600 mb-2 text-center">Wellbeing</h2>
          
        </div>

        <LiveLocationMap /> {/* Live location map component */}

        <button
          onClick={sendSOS}
          disabled={contacts.length === 0}
          className={`w-full py-4 rounded-lg flex items-center justify-center space-x-2 text-white text-lg font-semibold ${
            contacts.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          <Send className="h-6 w-6" />
          <span>Send SOS Alert</span>
        </button>
      </div>
    </div>
  );
}

export default App;
