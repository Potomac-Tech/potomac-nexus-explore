import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, FileText, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateBuyRequestFormProps {
  open: boolean;
  onClose: () => void;
}

export const CreateBuyRequestForm = ({ open, onClose }: CreateBuyRequestFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    dataType: "",
    description: "",
    requirements: "",
    timeframe: "",
    budget: "",
    deliveryFormat: "",
    qualityStandards: "",
    sampleData: "",
    deadline: "",
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Connect to backend API
    // const response = await supabase.functions.invoke('create-buy-request', {
    //   body: { ...formData, userId: user.id }
    // });
    
    console.log("Creating buy request:", formData);
    
    toast({
      title: "Buy Request Created",
      description: "Your data buy request has been posted to the marketplace.",
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Create Data Buy Request
          </DialogTitle>
          <DialogDescription>
            Specify the data you need and set terms for potential data providers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Request Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Lunar soil composition data from Mare Tranquillitatis"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataType">Data Category *</Label>
                    <Select onValueChange={(value) => handleInputChange("dataType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lunar">Lunar Surface Data</SelectItem>
                        <SelectItem value="seabed">Seabed Ecology</SelectItem>
                        <SelectItem value="materials">Material Science</SelectItem>
                        <SelectItem value="atmospheric">Atmospheric Data</SelectItem>
                        <SelectItem value="geological">Geological Surveys</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the specific data you need, its intended use, and any background context..."
                      className="h-24"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Technical Requirements *</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange("requirements", e.target.value)}
                      placeholder="Specify data format, resolution, accuracy requirements, measurement units, etc..."
                      className="h-20"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Terms & Conditions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Terms & Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="budget">Budget (USD) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="5000"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Funds will be held in escrow by Potomac until delivery
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeframe">Collection Timeframe</Label>
                    <Select onValueChange={(value) => handleInputChange("timeframe", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When should data be collected?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                        <SelectItem value="short">Short-term (1-3 months)</SelectItem>
                        <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
                        <SelectItem value="long">Long-term (6+ months)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryFormat">Preferred Delivery Format</Label>
                    <Input
                      id="deliveryFormat"
                      value={formData.deliveryFormat}
                      onChange={(e) => handleInputChange("deliveryFormat", e.target.value)}
                      placeholder="e.g., CSV, JSON, HDF5, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="qualityStandards">Quality Standards</Label>
                    <Textarea
                      id="qualityStandards"
                      value={formData.qualityStandards}
                      onChange={(e) => handleInputChange("qualityStandards", e.target.value)}
                      placeholder="Specify calibration requirements, error tolerances, documentation standards..."
                      className="h-16"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contract Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <Badge variant="outline">${formData.budget || "0"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <Badge variant="outline">{formData.deadline || "Not set"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Escrow:</span>
                      <Badge variant="secondary">Potomac Protected</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Post Buy Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};