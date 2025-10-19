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
      const response = await fetch("https://generativeai2006.app.n8n.cloud/webhook-test/n8n", {
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />
      
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Image Generation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create Amazing Images
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with AI-powered image generation
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 md:p-8 bg-gradient-card border-border shadow-card backdrop-blur-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium text-foreground">
                Describe your image
              </label>
              <Input
                id="prompt"
                placeholder="a cute astronaut cat on the moon"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerate()}
                className="h-12 text-base bg-secondary border-border focus:ring-primary"
                disabled={isGenerating}
              />
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-12 text-base font-medium bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Image Display */}
        {(isGenerating || generatedImage) && (
          <Card className="p-4 bg-gradient-card border-border shadow-card backdrop-blur-sm overflow-hidden">
            <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse-glow">
                      <ImageIcon className="w-20 h-20 text-primary opacity-50" />
                    </div>
                    <ImageIcon className="w-20 h-20 text-primary relative z-10" />
                  </div>
                  <p className="text-muted-foreground">Creating your masterpiece...</p>
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
