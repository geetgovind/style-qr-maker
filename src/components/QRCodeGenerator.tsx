
import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { type Options as QRCodeOptions, type FileExtension } from 'qr-code-styling';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download, Upload, Palette, Square, Dot, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
type CornerDotType = 'dot' | 'square';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export default function QRCodeGenerator() {
  const [options, setOptions] = useState<QRCodeOptions>({
    width: 300,
    height: 300,
    data: 'https://lovable.dev',
    margin: 10,
    image: '',
    dotsOptions: {
      color: '#4267b2',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 10,
      hideBackgroundDots: true,
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#000000'
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#000000'
    },
    qrOptions: {
      errorCorrectionLevel: 'Q'
    }
  });

  const [fileExt, setFileExt] = useState<FileExtension>('png');
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    qrCode.update(options);
  }, [qrCode, options]);

  const onDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptions(prev => ({ ...prev, data: e.target.value }));
  };
  
  const onMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, margin: Number(e.target.value) }));
  };

  const onSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, width: Number(e.target.value), height: Number(e.target.value) }));
  };

  const onDotsColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, dotsOptions: { ...prev.dotsOptions, color: e.target.value } }));
  };
  
  const onDotsTypeChange = (value: DotType) => {
    setOptions(prev => ({ ...prev, dotsOptions: { ...prev.dotsOptions, type: value } }));
  };

  const onBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, backgroundOptions: { ...prev.backgroundOptions, color: e.target.value } }));
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOptions(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onRemoveImage = () => {
    setOptions(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onImageOptionChange = (key: keyof QRCodeOptions['imageOptions'], value: any) => {
    setOptions(prev => ({ ...prev, imageOptions: { ...prev.imageOptions, [key]: value } }));
  };

  const onQrOptionsChange = (value: ErrorCorrectionLevel) => {
    setOptions(prev => ({ ...prev, qrOptions: { ...prev.qrOptions, errorCorrectionLevel: value } }));
  };

  const onCornersOptionsChange = (
    cornerType: 'cornersSquareOptions' | 'cornersDotOptions',
    option: 'type' | 'color',
    value: string
  ) => {
    setOptions(prev => ({
      ...prev,
      [cornerType]: { ...prev[cornerType], [option]: value }
    }));
  };

  const handleDownload = () => {
    qrCode.download({
      extension: fileExt
    });
    toast.success(`QR Code downloaded as ${fileExt.toUpperCase()}`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <Card className="md:col-span-1 bg-secondary/30 border-secondary">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Customize QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">Content</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Textarea id="data" value={options.data} onChange={onDataChange} placeholder="Enter URL or text" rows={3} />
                </div>
                 <div className="space-y-2">
                  <Label>Logo Image</Label>
                  <div className="flex space-x-2">
                    <Input type="file" id="image" ref={fileInputRef} onChange={onImageUpload} className="hidden" accept="image/*" />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                    {options.image && (
                      <Button variant="destructive" size="icon" onClick={onRemoveImage}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50">
                  <div className="space-y-0.5">
                    <Label>Hide background dots</Label>
                  </div>
                  <Switch
                    checked={options.imageOptions?.hideBackgroundDots}
                    onCheckedChange={(checked) => onImageOptionChange('hideBackgroundDots', checked)}
                    disabled={!options.image}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">Styling</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <Label htmlFor="size">Size (px)</Label>
                  <Input id="size" type="number" value={options.width} onChange={onSizeChange} min="100" max="2000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin">Margin (px)</Label>
                  <Input id="margin" type="number" value={options.margin} onChange={onMarginChange} min="0" max="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="error-correction">Error Correction</Label>
                  <Select onValueChange={onQrOptionsChange} defaultValue={options.qrOptions?.errorCorrectionLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low</SelectItem>
                      <SelectItem value="M">Medium</SelectItem>
                      <SelectItem value="Q">Quartile</SelectItem>
                      <SelectItem value="H">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dots-type">Dots Style</Label>
                   <Select onValueChange={(v: DotType) => onDotsTypeChange(v)} defaultValue={options.dotsOptions?.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dot style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square"><Square className="inline-block mr-2 h-4 w-4"/>Square</SelectItem>
                      <SelectItem value="dots"><Dot className="inline-block mr-2 h-4 w-4"/>Dots</SelectItem>
                      <SelectItem value="rounded"><Square className="inline-block mr-2 h-4 w-4 rounded-sm"/>Rounded</SelectItem>
                      <SelectItem value="extra-rounded"><Square className="inline-block mr-2 h-4 w-4 rounded-md"/>Extra Rounded</SelectItem>
                      <SelectItem value="classy"><ImageIcon className="inline-block mr-2 h-4 w-4"/>Classy</SelectItem>
                      <SelectItem value="classy-rounded"><ImageIcon className="inline-block mr-2 h-4 w-4"/>Classy Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dots-color">Dots Color</Label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="dots-color" type="color" value={options.dotsOptions?.color} onChange={onDotsColorChange} className="pl-10" />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="bg-color" type="color" value={options.backgroundOptions?.color} onChange={onBgColorChange} className="pl-10" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">Corner Styling</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                      <Label htmlFor="corners-square-type">Corner Square Style</Label>
                      <Select onValueChange={(v: CornerSquareType) => onCornersOptionsChange('cornersSquareOptions', 'type', v)} defaultValue={options.cornersSquareOptions?.type}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select corner square style" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="dot">Dot</SelectItem>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="corners-square-color">Corner Square Color</Label>
                      <div className="relative">
                          <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="corners-square-color" type="color" value={options.cornersSquareOptions?.color} onChange={(e) => onCornersOptionsChange('cornersSquareOptions', 'color', e.target.value)} className="pl-10" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="corners-dot-type">Corner Dot Style</Label>
                      <Select onValueChange={(v: CornerDotType) => onCornersOptionsChange('cornersDotOptions', 'type', v)} defaultValue={options.cornersDotOptions?.type}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select corner dot style" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="dot">Dot</SelectItem>
                              <SelectItem value="square">Square</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="corners-dot-color">Corner Dot Color</Label>
                      <div className="relative">
                          <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="corners-dot-color" type="color" value={options.cornersDotOptions?.color} onChange={(e) => onCornersOptionsChange('cornersDotOptions', 'color', e.target.value)} className="pl-10" />
                      </div>
                  </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2 flex flex-col items-center justify-center space-y-6">
        <Card className="p-6 bg-secondary/30 border-secondary">
          <div ref={ref} />
        </Card>
        <div className="flex w-full max-w-sm space-x-2">
          <Select onValueChange={(v: FileExtension) => setFileExt(v)} defaultValue={fileExt}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Ext" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
}
