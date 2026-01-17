'use client';

import { useEffect, useState } from 'react';
import { Activity, Box, Users, FileCode, Clock, Zap } from 'lucide-react';
import type { NetworkStats, Block, Transaction } from '@/types';
import { formatNumber, formatBBT, formatTimeAgo, shortenHash, shortenAddress, getTxTypeLabel, getStatusColor } from '@/lib/utils';

export default function Home() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTxs, setLatestTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        const [statsRes, blocksRes, txsRes] = await Promise.all([
          fetch(`${apiUrl}/stats`).then(r => r.ok ? r.json() : null),
          fetch(`${apiUrl}/blocks?limit=5`).then(r => r.ok ? r.json() : []),
          fetch(`${apiUrl}/transactions?limit=5`).then(r => r.ok ? r.json() : []),
        ]);

        setStats(statsRes);
        setLatestBlocks(Array.isArray(blocksRes) ? blocksRes : blocksRes.data || []);
        setLatestTxs(Array.isArray(txsRes) ? txsRes : txsRes.data || []);
      } catch (err) {
        setError('Failed to connect to node. Make sure the network is running.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 text-center">
          <div className="text-red-500 mb-4">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Connection Error
          </h2>
          <p className="text-gray-500">{error}</p>
          <p className="text-sm text-gray-400 mt-4">
            Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">make devnet-start</code> to start the network
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Bar */}
      <div className="card p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by address, transaction hash, or block height..."
            className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blueblocks-500"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Box className="w-6 h-6" />}
          label="Latest Block"
          value={stats?.latestBlockHeight?.toLocaleString() || '0'}
          subValue={stats?.latestBlockTime ? formatTimeAgo(stats.latestBlockTime) : ''}
          color="blue"
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          label="Transactions"
          value={formatNumber(stats?.totalTxs || 0)}
          subValue={`${stats?.tps1h?.toFixed(2) || '0'} TPS (1h)`}
          color="green"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Validators"
          value={`${stats?.activeValidators || 0}/${stats?.totalValidators || 0}`}
          subValue={`${formatBBT(stats?.totalStake || '0')} BBT staked`}
          color="purple"
        />
        <StatCard
          icon={<FileCode className="w-6 h-6" />}
          label="Contracts"
          value={formatNumber(stats?.totalContracts || 0)}
          subValue={`${formatNumber(stats?.totalAccounts || 0)} accounts`}
          color="orange"
        />
      </div>

      {/* Latest Blocks & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Blocks */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Blocks</h2>
            <a href="/blocks" className="text-sm text-blueblocks-600 hover:text-blueblocks-700">View all</a>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {latestBlocks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No blocks yet</div>
            ) : (
              latestBlocks.map((block) => (
                <div key={block.height} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blueblocks-100 dark:bg-blueblocks-900/30 rounded-lg flex items-center justify-center">
                        <Box className="w-5 h-5 text-blueblocks-600" />
                      </div>
                      <div>
                        <a href={`/block/${block.height}`} className="font-medium text-blueblocks-600 hover:text-blueblocks-700">
                          #{block.height.toLocaleString()}
                        </a>
                        <p className="text-xs text-gray-500">{formatTimeAgo(block.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{block.numTxs} txns</p>
                      <p className="text-xs text-gray-500">
                        {block.proposer ? shortenAddress(block.proposer, 4) : 'Genesis'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Transactions */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Transactions</h2>
            <a href="/transactions" className="text-sm text-blueblocks-600 hover:text-blueblocks-700">View all</a>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {latestTxs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No transactions yet</div>
            ) : (
              latestTxs.map((tx) => (
                <div key={tx.hash} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <a href={`/tx/${tx.hash}`} className="font-mono text-sm text-blueblocks-600 hover:text-blueblocks-700">
                          {shortenHash(tx.hash)}
                        </a>
                        <p className="text-xs text-gray-500">{formatTimeAgo(tx.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{getTxTypeLabel(tx.type)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-blueblocks-100 text-blueblocks-600 dark:bg-blueblocks-900/30',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-400">{subValue}</p>
        </div>
      </div>
    </div>
  );
}
