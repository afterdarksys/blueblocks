'use client';

import { useState } from 'react';
import { Download, Heart, Share2, Sparkles } from 'lucide-react';

const mascotImages = [
  {
    id: 'classic',
    src: '/images/mascot/blubee_01.jpg',
    title: 'Classic BluBee',
    description: 'The original BluBee - our beloved blue-gray mascot',
    tags: ['official', 'logo'],
  },
  {
    id: 'kawaii',
    src: '/images/mascot/blubee_02_cartoon.jpg',
    title: 'Kawaii BluBee',
    description: 'Adorable cartoon style with blockchain collar',
    tags: ['cute', 'cartoon'],
  },
  {
    id: 'memecoin',
    src: '/images/mascot/blubee_03_memecoin.jpg',
    title: 'BluBee Coin',
    description: 'BluBee holding the BBT coin - to the moon!',
    tags: ['meme', 'token', 'coin'],
  },
  {
    id: 'tech',
    src: '/images/mascot/blubee_04_tech.jpg',
    title: 'Tech BluBee',
    description: 'Surrounded by blockchain nodes and data streams',
    tags: ['tech', 'blockchain', 'cyberpunk'],
  },
  {
    id: 'computer',
    src: '/images/mascot/blubee_05_computer.jpg',
    title: 'Developer BluBee',
    description: 'BluBee coding smart contracts',
    tags: ['developer', 'coding', 'work'],
  },
  {
    id: 'disconnect',
    src: '/images/mascot/blubee_06_disconnect.jpg',
    title: 'Chaos BluBee',
    description: 'When BluBee unplugs the internet...',
    tags: ['meme', 'chaos', 'error'],
  },
  {
    id: 'tuna',
    src: '/images/mascot/blubee_07_tuna.jpg',
    title: 'Happy BluBee',
    description: 'BluBee enjoying well-deserved tuna',
    tags: ['happy', 'food', 'reward'],
  },
  {
    id: 'hug',
    src: '/images/mascot/blubee_08_hug.jpg',
    title: 'Huggy BluBee',
    description: 'BluBee wants to give you a big hug!',
    tags: ['love', 'community', 'welcome'],
  },
];

export default function BluBeePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const allTags = ['all', ...Array.from(new Set(mascotImages.flatMap(img => img.tags)))];

  const filteredImages = filter === 'all'
    ? mascotImages
    : mascotImages.filter(img => img.tags.includes(filter));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src="/images/mascot/blubee_08_hug.jpg"
                alt="BluBee"
                className="w-40 h-40 rounded-full object-cover border-4 border-blueblocks-500 shadow-xl shadow-blueblocks-500/30"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blueblocks-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Meet <span className="text-blueblocks-400">BluBee</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            The official mascot of BlueBlocks - a friendly blue-gray cat who loves blockchain technology,
            healthcare innovation, and the occasional tuna treat.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="#gallery"
              className="px-6 py-3 bg-blueblocks-600 hover:bg-blueblocks-700 text-white rounded-xl font-medium transition-colors"
            >
              View Gallery
            </a>
            <a
              href="/images/mascot/blubee_01.jpg"
              download="blubee_official.jpg"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Pack
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blueblocks-400">{mascotImages.length}</p>
            <p className="text-sm text-slate-400">Official Images</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">100%</p>
            <p className="text-sm text-slate-400">Open Source</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">CC0</p>
            <p className="text-sm text-slate-400">License</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">Infinite</p>
            <p className="text-sm text-slate-400">Cuteness</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div id="gallery" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">BluBee Gallery</h2>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === tag
                    ? 'bg-blueblocks-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-blueblocks-500 transition-all hover:shadow-xl hover:shadow-blueblocks-500/10"
            >
              <div className="relative aspect-square">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(image.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="flex gap-2">
                    <a
                      href={image.src}
                      download={`${image.id}.jpg`}
                      className="flex-1 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium text-center hover:bg-white/30 transition-colors"
                    >
                      <Download className="w-4 h-4 inline mr-1" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{image.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{image.description}</p>
                <div className="flex flex-wrap gap-1">
                  {image.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400" />
            BluBee Usage Guidelines
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Do</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  Use BluBee for BlueBlocks-related content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  Create memes and fan art
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  Share on social media with attribution
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  Use in presentations about BlueBlocks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  Create community stickers and emotes
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-3">Don't</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  Use to represent other projects
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  Create misleading or harmful content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  Sell BluBee merchandise without permission
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  Claim ownership of the character
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  Use in adult or offensive content
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Join the BluBee Community</h2>
        <p className="text-slate-400 mb-6">
          Share your BluBee creations with us on social media using #BluBee
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://twitter.com/blueblocks"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share on Twitter
          </a>
          <a
            href="https://discord.gg/blueblocks"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
          >
            Join Discord
          </a>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={mascotImages.find(img => img.id === selectedImage)?.src}
              alt="BluBee"
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
