import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import { fetchMovie } from "@/services/api";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { updateSearchCount } from "@/services/appwrite";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(
    () =>
      fetchMovie({
        query: searchQuery,
      }),
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      console.log("Search query:", searchQuery);

      if (searchQuery.trim()) {
        await loadMovies();

        console.log("Movies after loadMovies:");
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // Ensure `searchQuery` is the only dependency

  useEffect(() => {
    if (movies?.length > 0 && movies[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  // console.log("MOVIES:", movies);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie.."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                onPress={() => {}}
              />
            </View>
            {loading && (
              <ActivityIndicator
                size={"large"}
                color={"#0000ff"}
                className="my-3"
              />
            )}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-xl text-white font-bold">
                Search result for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? `No results found for ${searchQuery}`
                  : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
