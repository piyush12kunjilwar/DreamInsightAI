import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDreamSchema, insertSleepQualitySchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, LogOut } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const dreamForm = useForm({
    resolver: zodResolver(insertDreamSchema),
    defaultValues: {
      content: "",
    },
  });

  const sleepForm = useForm({
    resolver: zodResolver(insertSleepQualitySchema),
    defaultValues: {
      hoursSlept: 8,
      quality: 3,
      notes: "",
    },
  });

  const { data: dreams } = useQuery({
    queryKey: ["/api/dreams"],
  });

  const { data: sleepQualities } = useQuery({
    queryKey: ["/api/sleep"],
  });

  const { data: sleepAnalysis } = useQuery({
    queryKey: ["/api/sleep/analysis"],
  });

  const dreamMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await apiRequest("POST", "/api/dreams", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      dreamForm.reset();
      toast({
        title: "Dream recorded",
        description: "Your dream has been analyzed and saved.",
      });
    },
  });

  const sleepMutation = useMutation({
    mutationFn: async (data: {
      hoursSlept: number;
      quality: number;
      notes: string;
    }) => {
      const res = await apiRequest("POST", "/api/sleep", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sleep"] });
      sleepForm.reset();
      toast({
        title: "Sleep quality recorded",
        description: "Your sleep data has been saved.",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6" />
            <h1 className="text-2xl font-bold">DreamScape</h1>
          </div>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dreams">
          <TabsList className="mb-8">
            <TabsTrigger value="dreams">Dreams</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>

          <TabsContent value="dreams">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Record a Dream</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...dreamForm}>
                    <form
                      onSubmit={dreamForm.handleSubmit((data) =>
                        dreamMutation.mutate(data)
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={dreamForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your dream..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={dreamMutation.isPending}
                      >
                        {dreamMutation.isPending
                          ? "Analyzing..."
                          : "Record Dream"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dream Journal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dreams?.map((dream) => (
                    <div
                      key={dream.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <p className="text-sm text-muted-foreground">
                        {new Date(dream.date).toLocaleDateString()}
                      </p>
                      <p>{dream.content}</p>
                      {dream.interpretation && (
                        <p className="text-sm border-t pt-2 mt-2">
                          <strong>Interpretation:</strong> {dream.interpretation}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sleep">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Record Sleep Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...sleepForm}>
                    <form
                      onSubmit={sleepForm.handleSubmit((data) =>
                        sleepMutation.mutate(data)
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={sleepForm.control}
                        name="hoursSlept"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Hours Slept</Label>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="24"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={sleepForm.control}
                        name="quality"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Sleep Quality (1-5)</Label>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={sleepForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Notes</Label>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={sleepMutation.isPending}
                      >
                        {sleepMutation.isPending
                          ? "Recording..."
                          : "Record Sleep"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sleep Quality Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={sleepQualities?.map((sq) => ({
                          date: new Date(sq.date).toLocaleDateString(),
                          hours: sq.hoursSlept,
                          quality: sq.quality,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="hours"
                          stroke="#8884d8"
                          name="Hours Slept"
                        />
                        <Line
                          type="monotone"
                          dataKey="quality"
                          stroke="#82ca9d"
                          name="Quality"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {sleepAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sleep Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{sleepAnalysis.analysis}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
