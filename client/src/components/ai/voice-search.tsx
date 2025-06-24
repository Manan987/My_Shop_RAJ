import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function VoiceSearch({ onSearch, placeholder = "Search products..." }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();
      
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-IN'; // Indian English
      
      speechRecognition.onstart = () => {
        setIsListening(true);
      };
      
      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
      };
      
      speechRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice search error",
          description: "Unable to recognize speech. Please try again or type your search.",
          variant: "destructive",
        });
      };
      
      speechRecognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(speechRecognition);
    }
  }, [onSearch, toast]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        toast({
          title: "Listening...",
          description: "Speak your search query now",
        });
      } catch (error) {
        console.error('Failed to start recognition:', error);
        toast({
          title: "Voice search unavailable",
          description: "Please type your search query instead.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Voice search not supported",
        description: "Your browser doesn't support voice search. Please type your query.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-12"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>
      
      {recognition && (
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={handleVoiceToggle}
          className={`ml-2 ${isListening ? 'animate-pulse' : ''}`}
          title={isListening ? "Stop listening" : "Start voice search"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      )}
    </form>
  );
}