import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  changePositive?: boolean;
}

const StatCard = ({ title, value, change, description, changePositive = true }: StatCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-sm ${changePositive ? "text-green-500" : "text-red-500"}`}>
        {change} <span className="text-muted-foreground ml-1">{description}</span>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
