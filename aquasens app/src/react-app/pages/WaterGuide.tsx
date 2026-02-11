import { Card } from '@/react-app/components/ui/card';
import { BookOpen, Droplet, AlertCircle, CheckCircle, Info, Beaker, Activity } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  content: string[];
}

const guideSections: GuideSection[] = [
  {
    id: 'ph',
    title: 'pH Level',
    icon: Beaker,
    color: 'from-purple-400 to-pink-500',
    content: [
      'Optimal range: 6.5 - 8.5',
      'Below 6.5: Acidic water, may cause corrosion',
      'Above 8.5: Alkaline water, may taste bitter',
      'Neutral pH (7.0) is ideal for drinking'
    ]
  },
  {
    id: 'tds',
    title: 'TDS (Total Dissolved Solids)',
    icon: Activity,
    color: 'from-blue-400 to-cyan-500',
    content: [
      'Excellent: < 300 ppm',
      'Good: 300 - 600 ppm',
      'Fair: 600 - 900 ppm',
      'Poor: > 900 ppm',
      'Measures minerals and salts in water'
    ]
  },
  {
    id: 'turbidity',
    title: 'Turbidity',
    icon: Droplet,
    color: 'from-teal-400 to-emerald-500',
    content: [
      'Excellent: < 5 NTU',
      'Acceptable: 5 - 10 NTU',
      'Poor: > 10 NTU',
      'Measures cloudiness of water',
      'High turbidity can harbor bacteria'
    ]
  },
  {
    id: 'safety',
    title: 'Safety Guidelines',
    icon: AlertCircle,
    color: 'from-orange-400 to-red-500',
    content: [
      'Boil water if purity score is below 50',
      'Use water filters for scores 50-80',
      'Regular testing is recommended',
      'Store water in clean containers',
      'Replace filters as per manufacturer guidelines'
    ]
  }
];

const waterQualityTips = [
  {
    title: 'Safe to Drink',
    icon: CheckCircle,
    color: 'text-green-500',
    score: '80-100',
    description: 'Water is safe for drinking and cooking'
  },
  {
    title: 'Washing Only',
    icon: Info,
    color: 'text-yellow-500',
    score: '50-79',
    description: 'Suitable for washing and cleaning, not drinking'
  },
  {
    title: 'Unsafe',
    icon: AlertCircle,
    color: 'text-red-500',
    score: '0-49',
    description: 'Requires treatment before any use'
  }
];

export default function WaterGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 pb-24 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Water Guide
            </h1>
            <p className="text-sm text-muted-foreground">Learn about water quality</p>
          </div>
        </div>

        {/* Water Quality Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Purity Score Ranges</h2>
          <div className="space-y-3">
            {waterQualityTips.map((tip) => (
              <Card
                key={tip.title}
                className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tip.color.replace('text-', 'bg-')}/10`}>
                    <tip.icon className={`w-6 h-6 ${tip.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{tip.title}</div>
                      <div className={`text-sm font-bold ${tip.color}`}>{tip.score}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{tip.description}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Parameter Guides */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Parameter Guide</h2>
          <div className="space-y-4">
            {guideSections.map((section) => (
              <Card
                key={section.id}
                className="p-5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-md`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Tips */}
        <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 backdrop-blur-md border-cyan-300 dark:border-cyan-700">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
            <div className="space-y-2">
              <div className="font-semibold text-cyan-900 dark:text-cyan-100">Pro Tips</div>
              <ul className="space-y-1 text-sm text-cyan-800 dark:text-cyan-200">
                <li>• Test water regularly, especially after heavy rains</li>
                <li>• Keep your water testing equipment clean</li>
                <li>• Store drinking water in cool, dark places</li>
                <li>• Check local water quality reports</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
