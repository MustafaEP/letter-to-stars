import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { diaryApi } from '../api/diary.api';
import type { VocabularyWord } from '../types/diary.types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Layout from '../components/layout/Layout';
import {
  BookOpen,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Star,
  TrendingUp,
  SortAsc,
} from 'lucide-react';

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'alpha' | 'date' | 'level'>('alpha');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const data = await diaryApi.getVocabulary();
      setWords(data.words);
      setTotal(data.total);
    } catch (error) {
      console.error('Vocabulary error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = useMemo(() => {
    let result = [...words];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q)
      );
    }

    if (filterLevel) {
      result = result.filter((w) => w.ieltsLevel === filterLevel);
    }

    if (sortBy === 'alpha') {
      result.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'level') {
      result.sort((a, b) => b.ieltsLevel - a.ieltsLevel);
    }

    return result;
  }, [words, search, filterLevel, sortBy]);

  const groupedWords = useMemo(() => {
    if (sortBy !== 'alpha' || search) return null;

    const groups: Record<string, VocabularyWord[]> = {};
    filteredWords.forEach((word) => {
      const letter = word.word[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(word);
    });
    return groups;
  }, [filteredWords, sortBy, search]);

  const levelStyles: Record<number, { badge: string; glow: string }> = {
    6: {
      badge: 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
      glow: 'shadow-blue-500/20',
    },
    7: {
      badge: 'bg-green-500/20 text-green-400 border border-green-400/30',
      glow: 'shadow-green-500/20',
    },
    8: {
      badge: 'bg-amber-500/20 text-amber-400 border border-amber-400/30',
      glow: 'shadow-amber-500/20',
    },
    9: {
      badge: 'bg-purple-500/20 text-purple-400 border border-purple-400/30',
      glow: 'shadow-purple-500/20',
    },
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Kelimeler yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-400/30">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <h1 className="text-4xl font-bold text-cosmic-gradient glow-ice">
                  Kelime Defterim
                </h1>
              </div>
              <p className="text-gray-300 text-lg flex items-center gap-2 ml-1">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Toplam{' '}
                <span className="font-bold text-purple-400">{total}</span>{' '}
                kelime öğrendin!
              </p>
            </div>
            <Link
              to="/diary/calendar"
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              ← Geri
            </Link>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Kelime veya anlam ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>

            {/* IELTS Filter */}
            <div className="flex gap-2 flex-wrap">
              {([null, 6, 7, 8, 9] as (number | null)[]).map((level) => (
                <button
                  key={level ?? 'all'}
                  onClick={() => setFilterLevel(level)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterLevel === level
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-white/10'
                  }`}
                >
                  {level ? `IELTS ${level}` : 'Tümü'}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="input-field pl-9 py-2 text-sm appearance-none pr-8"
              >
                <option value="alpha">A-Z Sırala</option>
                <option value="date">Tarihe Göre</option>
                <option value="level">IELTS Seviyesine Göre</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white/10 text-cyan-400 shadow'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                title="Grid Görünüm"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white/10 text-cyan-400 shadow'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                title="Liste Görünüm"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Result Count */}
        {search && (
          <p className="text-sm text-gray-400 mb-4">
            &ldquo;{search}&rdquo; için{' '}
            <span className="text-cyan-400 font-medium">{filteredWords.length}</span>{' '}
            sonuç bulundu
          </p>
        )}

        {/* Empty State */}
        {filteredWords.length === 0 && (
          <div className="glass-card text-center py-16 px-6">
            <div className="relative inline-block mb-6">
              <BookOpen className="w-20 h-20 text-purple-400 animate-float" />
              <div className="absolute inset-0 blur-2xl bg-purple-400/20" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">
              {search ? 'Arama sonucu bulunamadı' : 'Henüz kelime yok'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {search
                ? 'Farklı bir kelime aramayı dene.'
                : 'Günlük yaz, yapay zeka yeni kelimeler keşfetsin!'}
            </p>
            {!search && (
              <Link to="/diary" className="btn-primary inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                İlk Günlüğünü Yaz
              </Link>
            )}
          </div>
        )}

        {/* Alphabetic Grouped Grid */}
        {groupedWords && viewMode === 'grid' && (
          <div className="space-y-8">
            {Object.entries(groupedWords)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, letterWords]) => (
                <div key={letter}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-cosmic-gradient w-10">
                      {letter}
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-gray-500">
                      {letterWords.length} kelime
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {letterWords.map((word, idx) => (
                      <WordCard
                        key={idx}
                        word={word}
                        levelStyle={levelStyles[word.ieltsLevel]}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Normal Grid */}
        {!groupedWords && viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredWords.map((word, idx) => (
              <WordCard
                key={idx}
                word={word}
                levelStyle={levelStyles[word.ieltsLevel]}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredWords.length > 0 && (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Kelime
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Türkçe Anlamı
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      IELTS
                    </div>
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Öğrenme Tarihi
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredWords.map((word, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors">
                        {word.word}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{word.meaning}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          levelStyles[word.ieltsLevel]?.badge ?? ''
                        }`}
                      >
                        {word.ieltsLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">
                      {format(new Date(word.date), 'd MMM yyyy', { locale: tr })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

function WordCard({
  word,
  levelStyle,
}: {
  word: VocabularyWord;
  levelStyle: { badge: string; glow: string };
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer glass-card p-4 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5 select-none"
      style={{ minHeight: '100px' }}
    >
      {!flipped ? (
        <div className="flex flex-col justify-between h-full gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full self-start ${levelStyle?.badge ?? ''}`}>
            {word.ieltsLevel}
          </span>
          <p className="font-bold text-gray-100 text-sm leading-tight">
            {word.word}
          </p>
          <p className="text-xs text-gray-500">
            {format(new Date(word.date), 'd MMM', { locale: tr })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center h-full gap-2">
          <p className="text-sm text-cyan-300 font-medium text-center">
            {word.meaning}
          </p>
          <p className="text-xs text-gray-600 text-center">
            tekrar çevir
          </p>
        </div>
      )}
    </div>
  );
}
