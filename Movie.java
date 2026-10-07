public class Movie {

    private int movieId;
    private String title;
    private String genre;
    private String language;
    private double rating;

    public Movie(int movieId, String title, String genre,
                 String language, double rating) {

        this.movieId = movieId;
        this.title = title;
        this.genre = genre;
        this.language = language;
        this.rating = rating;
    }

    public int getMovieId() {
        return movieId;
    }

    public String getTitle() {
        return title;
    }

    public String getGenre() {
        return genre;
    }

    public String getLanguage() {
        return language;
    }

    public double getRating() {
        return rating;
    }

    public void displayMovie() {

        System.out.println("----------------------------------------");
        System.out.println("Movie ID : " + movieId);
        System.out.println("Title    : " + title);
        System.out.println("Genre    : " + genre);
        System.out.println("Language : " + language);
        System.out.println("Rating   : " + rating);
        System.out.println("----------------------------------------");
    }
}