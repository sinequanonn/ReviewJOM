package rewviewjom.backend.global.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;
import rewviewjom.backend.tag.domain.repository.TagRepository;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TagRepository tagRepository;

    @Override
    public void run(String... args) throws Exception {
        if (tagRepository.count() == 0) {
            initializeTags();
            log.info("Tags initialized successfully");
        }
    }

    private void initializeTags() {
        List<Tag> languageTags = List.of(
                new Tag("Java", TagCategory.LANGUAGE),
                new Tag("Python", TagCategory.LANGUAGE),
                new Tag("JavaScript", TagCategory.LANGUAGE),
                new Tag("TypeScript", TagCategory.LANGUAGE),
                new Tag("C", TagCategory.LANGUAGE),
                new Tag("C++", TagCategory.LANGUAGE),
                new Tag("C#", TagCategory.LANGUAGE),
                new Tag("Go", TagCategory.LANGUAGE),
                new Tag("Rust", TagCategory.LANGUAGE),
                new Tag("Kotlin", TagCategory.LANGUAGE),
                new Tag("Swift", TagCategory.LANGUAGE),
                new Tag("Ruby", TagCategory.LANGUAGE),
                new Tag("PHP", TagCategory.LANGUAGE)
        );

        List<Tag> frameworkTags = List.of(
                new Tag("Spring", TagCategory.FRAMEWORK),
                new Tag("React", TagCategory.FRAMEWORK),
                new Tag("Vue", TagCategory.FRAMEWORK),
                new Tag("Angular", TagCategory.FRAMEWORK),
                new Tag("Node.js", TagCategory.FRAMEWORK),
                new Tag("Django", TagCategory.FRAMEWORK),
                new Tag("FastAPI", TagCategory.FRAMEWORK),
                new Tag(".NET", TagCategory.FRAMEWORK),
                new Tag("Flutter", TagCategory.FRAMEWORK)
        );

        tagRepository.saveAll(languageTags);
        tagRepository.saveAll(frameworkTags);
    }
}
