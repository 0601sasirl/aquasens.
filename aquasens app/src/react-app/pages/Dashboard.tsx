import { useState, useEffect } from 'react';
import { Droplet, Activity, Beaker, Thermometer, AlertCircle, CheckCircle, XCircle, Bluetooth, BluetoothConnected, BluetoothOff } from 'lucide-react';
import { Card } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Switch } from '@/react-app/components/ui/switch';
import { Label } from '@/react-app/components/ui/label';
import { useESP32 } from '@/react-app/hooks/useESP32';

interface SensorData {
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
}

export default function Dashboard() {
  const [demoMode, setDemoMode] = useState(true);
  const [testing, setTesting] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    ph: 7.2,
    tds: 120,
    turbidity: 2.5,
    temperature: 22.5
  });

  const { isConnected, connectionError, connect, disconnect, deviceName } = useESP32();

  const calculatePurityScore = (data: SensorData): number => {
    let score = 100;
    
    // pH: optimal 6.5-8.5
    if (data.ph < 6.5 || data.ph > 8.5) score -= 20;
    else if (data.ph < 7.0 || data.ph > 8.0) score -= 10;
    
    // TDS: <300 excellent, 300-600 good, >600 poor
    if (data.tds > 600) score -= 30;
    else if (data.tds > 300) score -= 15;
    
    // Turbidity: <5 excellent, 5-10 acceptable, >10 poor
    if (data.turbidity > 10) score -= 30;
    else if (data.turbidity > 5) score -= 15;
    
    // Temperature: 15-25°C optimal
    if (data.temperature < 10 || data.temperature > 30) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const purityScore = calculatePurityScore(sensorData);

  const getStatus = (score: number) => {
    if (score >= 80) return { text: 'SAFE TO DRINK', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' };
    if (score >= 50) return { text: 'WASHING ONLY', icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { text: 'UNSAFE', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const status = getStatus(purityScore);

  const getGaugeColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  // Demo mode auto-update
  useEffect(() => {
    if (!demoMode || isConnected) return;

    const interval = setInterval(() => {
      setSensorData({
        ph: Number((6.5 + Math.random() * 2).toFixed(1)),
        tds: Math.floor(80 + Math.random() * 200),
        turbidity: Number((1 + Math.random() * 8).toFixed(1)),
        temperature: Number((20 + Math.random() * 8).toFixed(1))
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [demoMode, isConnected]);

  // Auto-disable demo mode when connected
  useEffect(() => {
    if (isConnected) {
      setDemoMode(false);
    }
  }, [isConnected]);

  const handleESP32Connect = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect((data) => {
        setSensorData(data);
      });
    }
  };

  const handleStartTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      if (demoMode && !isConnected) {
        setSensorData({
          ph: Number((6.5 + Math.random() * 2).toFixed(1)),
          tds: Math.floor(80 + Math.random() * 200),
          turbidity: Number((1 + Math.random() * 8).toFixed(1)),
          temperature: Number((20 + Math.random() * 8).toFixed(1))
        });
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 pb-24 overflow-hidden relative">
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -right-40 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Droplet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                AquaSens
              </h1>
              <p className="text-sm text-muted-foreground">Water Purity Monitor</p>
            </div>
          </div>
        </div>

        {/* ESP32 Connection */}
        <Card className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                {isConnected ? (
                  <BluetoothConnected className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Bluetooth className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="font-medium">ESP32 Connection</span>
              </Label>
              <Button
                onClick={handleESP32Connect}
                variant={isConnected ? "destructive" : "default"}
                size="sm"
                className={isConnected ? '' : 'bg-blue-600 hover:bg-blue-700'}
              >
                {isConnected ? (
                  <>
                    <BluetoothOff className="w-4 h-4 mr-2" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </div>
            {isConnected && deviceName && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Connected to {deviceName}
                </span>
              </div>
            )}
            {connectionError && (
              <div className="text-xs text-red-600 dark:text-red-400">
                {connectionError}
              </div>
            )}
            {!isConnected && !connectionError && (
              <p className="text-xs text-muted-foreground">
                Connect to ESP32 via Bluetooth to receive live sensor data
              </p>
            )}
          </div>
        </Card>

        {/* Demo Mode Toggle */}
        <Card className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center justify-between">
            <Label htmlFor="demo-mode" className="flex items-center gap-2 cursor-pointer">
              <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="font-medium">Demo Mode</span>
            </Label>
            <Switch
              id="demo-mode"
              checked={demoMode}
              onCheckedChange={setDemoMode}
              disabled={isConnected}
            />
          </div>
          {demoMode && !isConnected && (
            <p className="text-xs text-muted-foreground mt-2">
              Auto-generating sensor values every 5 seconds
            </p>
          )}
          {isConnected && (
            <p className="text-xs text-muted-foreground mt-2">
              Disabled while connected to ESP32
            </p>
          )}
        </Card>

        {/* Purity Score Gauge */}
        <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800 shadow-xl shadow-cyan-500/10">
          <div className="text-center space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Water Purity Score</p>
            <div className="relative w-48 h-48 mx-auto">
              {/* Background circle */}
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(purityScore / 100) * 552.92} 552.92`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                  style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={purityScore >= 80 ? 'text-green-400' : purityScore >= 50 ? 'text-yellow-400' : 'text-red-400'} stopColor="currentColor" />
                    <stop offset="100%" className={purityScore >= 80 ? 'text-emerald-500' : purityScore >= 50 ? 'text-orange-500' : 'text-rose-500'} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-5xl font-bold bg-gradient-to-br ${getGaugeColor(purityScore)} bg-clip-text text-transparent transition-all duration-500`}>
                  {purityScore}
                </div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Card */}
        <Card className={`p-6 ${status.bg} backdrop-blur-sm border-2 ${status.color.replace('text-', 'border-')} shadow-lg ${purityScore >= 80 ? 'animate-pulse' : ''}`}>
          <div className="flex items-center justify-center gap-3">
            <status.icon className={`w-8 h-8 ${status.color}`} />
            <div className={`text-2xl font-bold ${status.color}`}>
              {status.text}
            </div>
          </div>
        </Card>

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 gap-4">
          <SensorCard
            icon={Beaker}
            label="pH Level"
            value={sensorData.ph.toFixed(1)}
            unit=""
            color="from-purple-400 to-pink-500"
          />
          <SensorCard
            icon={Activity}
            label="TDS"
            value={sensorData.tds.toString()}
            unit="ppm"
            color="from-blue-400 to-cyan-500"
          />
          <SensorCard
            icon={Droplet}
            label="Turbidity"
            value={sensorData.turbidity.toFixed(1)}
            unit="NTU"
            color="from-teal-400 to-emerald-500"
          />
          <SensorCard
            icon={Thermometer}
            label="Temperature"
            value={sensorData.temperature.toFixed(1)}
            unit="°C"
            color="from-orange-400 to-red-500"
          />
        </div>

        {/* Start Test Button */}
        <Button
          onClick={handleStartTest}
          disabled={testing}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300"
        >
          {testing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Testing Water...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5" />
              Start Test
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

interface SensorCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  color: string;
}

function SensorCard({ icon: Icon, label, value, unit, color }: SensorCardProps) {
  return (
    <Card className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="space-y-2">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
      </div>
    </Card>
  );
}
