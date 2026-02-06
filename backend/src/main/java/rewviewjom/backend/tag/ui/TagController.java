package rewviewjom.backend.tag.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import rewviewjom.backend.global.response.ApiResponse;
import rewviewjom.backend.tag.application.TagService;
import rewviewjom.backend.tag.application.dto.TagResponse;
import rewviewjom.backend.tag.domain.TagCategory;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ApiResponse<List<TagResponse>> getAllTags(
            @RequestParam(required = false) TagCategory category) {
        if (category != null) {
            return ApiResponse.success(tagService.getTagsByCategory(category));
        }
        return ApiResponse.success(tagService.getAllTags());
    }
}
