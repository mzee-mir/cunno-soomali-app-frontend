import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
    searchQuery: z.string({
      required_error: "search.searchBar.requiredError",
    }),
  });
  
export type SearchForm = z.infer<typeof formSchema>;
  
type Props = {
    onSubmit: (formData: SearchForm) => void;
    placeHolder: string;
    onReset?: () => void;
    searchQuery?: string;
};

const SearchBar = ({ onSubmit, onReset, placeHolder, searchQuery }: Props) => {
  const { t } = useTranslation();
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

  useEffect(() => {
    form.reset({ searchQuery });
  }, [form, searchQuery]);

  const handleReset = () => {
    form.reset({
        searchQuery: "",
    });

    if(onReset){
        onReset();
    }
  }

  return (
    <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className={`flex item-center gap-3 justify-between flex-row bg-borde-border-2 bg-input rounded-full p-3 mx-5 ${form.formState.errors.searchQuery && "border-red-500"}`}
        >
            <Search strokeWidth={2.0} size={30} className="ml-1 text-blue-500 hidden md:block "/>
            <FormField 
                control={form.control} 
                name="searchQuery" 
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormControl>
                            <Input 
                                {...field} 
                                className="border-none shadow-none text-xl focus-visible:ring-0"
                                placeholder={placeHolder || t('search.searchBar.search')}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <Button 
                onClick={handleReset}
                type="button" 
                variant="outline" 
                className="rounded-full" 
            > 
                {t('search.searchBar.reset')} 
            </Button>

            <Button 
                type="submit" 
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-400 hover:to-blue-600 transition-all duration-300" 
            > 
                {t('search.searchBar.search')} 
            </Button>
        </form>
    </Form>
  )
}

export default SearchBar;