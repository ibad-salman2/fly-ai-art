import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Image as ImageIcon } from "lucide-react";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the image you want to generate",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("https://generativeai2006.app.n8n.cloud/webhook/n8n", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }

      // Convert the binary response to a blob
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setGeneratedImage(imageUrl);
      
      toast({
        title: "Image generated!",
        description: "Your AI-generated image is ready",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />
      
      <div className="max-w-4xl w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-card rounded-full border border-primary shadow-glow">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm text-primary font-medium">AI Image Generation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent px-4">
            Create Amazing Images
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Transform your ideas into stunning visuals with AI-powered image generation
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-4 sm:p-6 md:p-8 bg-gradient-card border-primary shadow-glow backdrop-blur-sm">
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-xs sm:text-sm font-medium text-primary">
                Describe your image
              </label>
              <Input
                id="prompt"
                placeholder="a cute astronaut cat on the moon"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerate()}
                className="h-10 sm:h-12 text-sm sm:text-base bg-secondary border-primary focus:ring-primary focus:ring-2 placeholder:text-muted-foreground"
                disabled={isGenerating}
              />
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium bg-gradient-primary hover:opacity-90 transition-all shadow-glow hover:shadow-[0_0_80px_hsl(195_100%_55%/0.7)] text-background"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Image Display */}
        {(isGenerating || generatedImage) && (
          <Card className="p-3 sm:p-4 bg-gradient-card border-primary shadow-glow backdrop-blur-sm overflow-hidden">
            <div className="aspect-square rounded-lg bg-secondary border border-primary/30 flex items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="text-center space-y-3 sm:space-y-4 px-4">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse-glow">
                      <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary opacity-50" />
                    </div>
                    <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary relative z-10" />
                  </div>
                  <p className="text-xs sm:text-sm text-primary font-medium">Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated image"
                  className="w-full h-full object-contain rounded-lg animate-in fade-in duration-500"
                />
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
