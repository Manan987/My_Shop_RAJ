import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, Calendar, Target } from "lucide-react";
import type { Category } from "@/types";

interface ForecastData {
  category: string;
  currentMonth: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export default function SalesForecasting() {
  const [selectedPeriod, setSelectedPeriod] = useState("3");
  const [forecastData] = useState<ForecastData[]>([
    {
      category: "Men's Clothing",
      currentMonth: 125000,
      predicted: 142000,
      trend: 'up',
      confidence: 85
    },
    {
      category: "Women's Clothing",
      currentMonth: 189000,
      predicted: 205000,
      trend: 'up',
      confidence: 78
    },
    {
      category: "Kids' Clothing",
      currentMonth: 87000,
      predicted: 92000,
      trend: 'up',
      confidence: 82
    },
    {
      category: "Accessories",
      currentMonth: 45000,
      predicted: 41000,
      trend: 'down',
      confidence: 72
    }
  ]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const totalPredicted = forecastData.reduce((sum, item) => sum + item.predicted, 0);
  const totalCurrent = forecastData.reduce((sum, item) => sum + item.currentMonth, 0);
  const overallGrowth = ((totalPredicted - totalCurrent) / totalCurrent) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-raj-neutral-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-raj-primary" />
            Sales Forecasting
          </h2>
          <p className="text-raj-neutral-600 mt-1">AI-powered demand prediction for inventory planning</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Next Month</SelectItem>
              <SelectItem value="3">Next Quarter</SelectItem>
              <SelectItem value="6">Next 6 Months</SelectItem>
              <SelectItem value="12">Next Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="raj-primary hover:raj-primary-dark text-white">
            <Target className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">Total Predicted Sales</p>
                <p className="text-2xl font-bold text-blue-900">₹{totalPredicted.toLocaleString()}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm">Expected Growth</p>
                <p className="text-2xl font-bold text-green-900">+{overallGrowth.toFixed(1)}%</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">Avg. Confidence</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round(forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length)}%
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-raj-primary" />
            Category-wise Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecastData.map((item, index) => {
              const growth = ((item.predicted - item.currentMonth) / item.currentMonth) * 100;
              
              return (
                <div key={index} className="p-4 border border-raj-neutral-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-raj-neutral-900">{item.category}</h3>
                    <div className="flex items-center gap-2">
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : item.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                      )}
                      <span className={`text-sm font-medium ${
                        growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-raj-neutral-600">Current Month</p>
                      <p className="text-lg font-semibold">₹{item.currentMonth.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-raj-neutral-600">Predicted</p>
                      <p className="text-lg font-semibold text-raj-primary">₹{item.predicted.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-raj-neutral-600">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-raj-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{item.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-raj-neutral-50 to-white">
        <CardHeader>
          <CardTitle className="text-raj-primary">AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-raj-neutral-700">
                <strong>Women's Clothing</strong> shows the highest growth potential. Consider increasing inventory by 15-20%.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-raj-neutral-700">
                <strong>Kids' Clothing</strong> demand expected to rise during upcoming festival season.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-raj-neutral-700">
                <strong>Accessories</strong> showing decline. Consider promotional campaigns or new product launches.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}