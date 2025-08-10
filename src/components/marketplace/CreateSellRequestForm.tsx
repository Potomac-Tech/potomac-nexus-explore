import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, DollarSign, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateSellRequestFormProps {
  open: boolean;
  onClose: () => void;
}

export const CreateSellRequestForm = ({ open, onClose }: CreateSellRequestFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    dataType: "",
    description: "",
    methodology: "",
    price: "",
    dataSize: "",
    format: "",
    collectionDate: "",
    sampleAvailable: false,
    licensing: "",
    exclusivity: "",
    documentation: "",
    calibrationInfo: "",
    dataQuality: "",
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Connect to backend API and Stripe
    // const response = await supabase.functions.invoke('create-sell-request', {
    //   body: { ...formData, userId: user.id }
    // });
    
    console.log("Creating sell request:", formData);
    
    toast({
      title: "Sell Request Created",
      description: "Your data is now available in the marketplace.",
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            List Data for Sale
          </DialogTitle>
          <DialogDescription>
            Offer your existing data to the research community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Data Information */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Data Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Data Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., High-resolution lunar crater depth measurements"
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
                      placeholder="Describe what the data contains, its scope, geographic/temporal coverage..."
                      className="h-24"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="methodology">Collection Methodology *</Label>
                    <Textarea
                      id="methodology"
                      value={formData.methodology}
                      onChange={(e) => handleInputChange("methodology", e.target.value)}
                      placeholder="Describe how the data was collected, instruments used, procedures followed..."
                      className="h-20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="collectionDate">Collection Date</Label>
                      <Input
                        id="collectionDate"
                        type="date"
                        value={formData.collectionDate}
                        onChange={(e) => handleInputChange("collectionDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataSize">Data Size</Label>
                      <Input
                        id="dataSize"
                        value={formData.dataSize}
                        onChange={(e) => handleInputChange("dataSize", e.target.value)}
                        placeholder="e.g., 2.5 GB, 10k records"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quality & Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dataQuality">Data Quality Assessment</Label>
                    <Textarea
                      id="dataQuality"
                      value={formData.dataQuality}
                      onChange={(e) => handleInputChange("dataQuality", e.target.value)}
                      placeholder="Describe accuracy, completeness, any known limitations or errors..."
                      className="h-16"
                    />
                  </div>

                  <div>
                    <Label htmlFor="calibrationInfo">Calibration Information</Label>
                    <Textarea
                      id="calibrationInfo"
                      value={formData.calibrationInfo}
                      onChange={(e) => handleInputChange("calibrationInfo", e.target.value)}
                      placeholder="Calibration procedures, standards used, traceability..."
                      className="h-16"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sampleAvailable"
                      checked={formData.sampleAvailable}
                      onCheckedChange={(checked) => handleInputChange("sampleAvailable", checked as boolean)}
                    />
                    <Label htmlFor="sampleAvailable">Sample data available for preview</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Pricing & Terms */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Pricing & Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="2500"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Payment processed through Stripe
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="format">Data Format *</Label>
                    <Input
                      id="format"
                      value={formData.format}
                      onChange={(e) => handleInputChange("format", e.target.value)}
                      placeholder="e.g., CSV, JSON, HDF5, NetCDF"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="licensing">License Terms</Label>
                    <Select onValueChange={(value) => handleInputChange("licensing", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select license type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commercial">Commercial Use Allowed</SelectItem>
                        <SelectItem value="research">Research Use Only</SelectItem>
                        <SelectItem value="attribution">Attribution Required</SelectItem>
                        <SelectItem value="custom">Custom License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="exclusivity">Exclusivity</Label>
                    <Select onValueChange={(value) => handleInputChange("exclusivity", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exclusivity terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non-exclusive">Non-exclusive (can sell to multiple buyers)</SelectItem>
                        <SelectItem value="exclusive">Exclusive (single buyer only)</SelectItem>
                        <SelectItem value="limited">Limited exclusivity (up to 3 buyers)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documentation">Additional Documentation</Label>
                    <Textarea
                      id="documentation"
                      value={formData.documentation}
                      onChange={(e) => handleInputChange("documentation", e.target.value)}
                      placeholder="List any additional documentation, metadata files, user guides included..."
                      className="h-16"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Listing Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <Badge variant="outline">${formData.price || "0"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="secondary">{formData.dataType || "Not selected"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sample Available:</span>
                      <Badge variant={formData.sampleAvailable ? "default" : "outline"}>
                        {formData.sampleAvailable ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment:</span>
                      <Badge variant="secondary">Stripe Secure</Badge>
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
              List Data for Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};