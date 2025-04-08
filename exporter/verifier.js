/* 
Rule Set:

excluded can be omitted if no files are excluded
    excluded must be a string[]
    if empty, interpret as []

included can be omitted if no files are included
    included must be a string[]
    if empty, interpret as []

build CANNOT be missing
build.name CANNOT be missing
    build.name must be a string
    build.name cannot be only whitespace or be empty

build.id CANNOT be missing
    build.id must be a string
    build.id cannot contain whitespace or be empty
    build.id should only have 1 "." splitting the developer name and the name of the module
    build.id cannot contain any special characters besides underscores and the singular "."

build.process CANNOT be missing
    build.process must be a string
    build.process cannot be whitespace or be empty

build.replace can be omitted if nothing needs to be replaced.
    build.replace must be an array of objects
    foreach in build.replace
        build.replace.[from] cannot be missing
            build.replace.[from] must be a string
            build.replace.[from] must not be empty

        build.replace.[to] cannot be missing
            build.replace.[to] must be a string
            build.replace.[to] CAN be empty
            if build.replace.[to] is surrounded by %, take property from build object.

        build.replace.[at] cannot be missing
            build.replace.[at] must be a string[] or an empty array.
*/