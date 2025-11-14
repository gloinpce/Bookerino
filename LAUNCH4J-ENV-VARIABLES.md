# Launch4j Environment Variables Guide

This guide explains how to configure environment variables for the Bookerino executable created with Launch4j.

## Quick Start

Edit `create-exe-launch4j-with-classpath.bat` and modify the `ENV_VARS` variable:

```batch
set "ENV_VARS=DATABASE_URL=jdbc:sqlite:./bookerino.db;LOG_LEVEL=INFO"
```

Then run the script to create the executable with these environment variables.

## Available Environment Variables

### Database Configuration

**`DATABASE_URL`** (Recommended)
- **Purpose**: Database connection string
- **Default**: `jdbc:sqlite:./bookerino.db`
- **Examples**:
  ```batch
  DATABASE_URL=jdbc:sqlite:./bookerino.db
  DATABASE_URL=jdbc:postgresql://localhost:5432/bookerino
  DATABASE_URL=jdbc:postgresql://user:pass@host:5432/dbname
  ```

### Logging Configuration

**`LOG_LEVEL`**
- **Purpose**: Set application logging level
- **Values**: `DEBUG`, `INFO`, `WARN`, `ERROR`
- **Example**:
  ```batch
  LOG_LEVEL=DEBUG
  ```

### Application Mode

**`APP_MODE`**
- **Purpose**: Set application mode
- **Values**: `development`, `production`
- **Example**:
  ```batch
  APP_MODE=production
  ```

### JVM Options

**`JAVA_OPTS`**
- **Purpose**: JVM command-line options
- **Examples**:
  ```batch
  JAVA_OPTS=-Xmx512m -Xms256m
  JAVA_OPTS=-Dfile.encoding=UTF-8 -Xmx1024m
  ```

### Application Home Directory

**`APP_HOME`**
- **Purpose**: Set application home directory
- **Example**:
  ```batch
  APP_HOME=C:\Program Files\Bookerino
  ```

## Configuration Examples

### Example 1: SQLite Database (Default)
```batch
set "ENV_VARS=DATABASE_URL=jdbc:sqlite:./bookerino.db"
```

### Example 2: PostgreSQL Database
```batch
set "ENV_VARS=DATABASE_URL=jdbc:postgresql://localhost:5432/bookerino;LOG_LEVEL=INFO"
```

### Example 3: Production Setup
```batch
set "ENV_VARS=DATABASE_URL=jdbc:postgresql://prod-server:5432/bookerino;APP_MODE=production;LOG_LEVEL=WARN;JAVA_OPTS=-Xmx1024m -Xms512m"
```

### Example 4: Development Setup
```batch
set "ENV_VARS=DATABASE_URL=jdbc:sqlite:./bookerino-dev.db;APP_MODE=development;LOG_LEVEL=DEBUG"
```

### Example 5: Custom Configuration
```batch
set "ENV_VARS=DATABASE_URL=jdbc:postgresql://localhost:5432/bookerino;LOG_LEVEL=INFO;APP_HOME=C:\Bookerino"
```

## How to Use

### Method 1: Edit the Script (Recommended)

1. Open `create-exe-launch4j-with-classpath.bat`
2. Find the `ENV_VARS` section (around line 30)
3. Modify the variable:
   ```batch
   set "ENV_VARS=DATABASE_URL=jdbc:sqlite:./bookerino.db;LOG_LEVEL=INFO"
   ```
4. Run the script:
   ```batch
   create-exe-launch4j-with-classpath.bat
   ```

### Method 2: Edit Standard Script

1. Open `create-exe-launch4j.bat`
2. Find the `ENV_VARS` variable (around line 15)
3. Modify as needed
4. Run the script

## Format Rules

- **Separator**: Use semicolon (`;`) to separate multiple variables
- **Format**: `NAME=VALUE`
- **No spaces**: Avoid spaces around `=` sign
- **Quotes**: Values with spaces don't need quotes (Launch4j handles it)

**Correct:**
```batch
set "ENV_VARS=DATABASE_URL=jdbc:sqlite:./bookerino.db;LOG_LEVEL=INFO"
```

**Incorrect:**
```batch
set "ENV_VARS=DATABASE_URL = jdbc:sqlite:./bookerino.db ; LOG_LEVEL = INFO"
```

## Verification

After creating the executable, you can verify environment variables are set:

1. Run the executable
2. Check application logs (if logging is enabled)
3. The application should use the configured `DATABASE_URL`

## Troubleshooting

### Environment variables not working
- Ensure format is correct: `NAME=VALUE` (no spaces around `=`)
- Check that variables are separated by semicolons
- Verify Launch4j XML was generated correctly (check `launch4j-config.xml`)

### Database connection issues
- Verify `DATABASE_URL` format is correct
- Check database server is running (for PostgreSQL)
- Ensure database file exists (for SQLite)

### JVM options not applied
- `JAVA_OPTS` may need to be set differently depending on Launch4j version
- Consider using Launch4j's `<opt>` element for JVM options instead

## Launch4j XML Structure

The environment variables are added to the Launch4j XML as:

```xml
<env>
  <envVar name="DATABASE_URL" value="jdbc:sqlite:./bookerino.db"/>
  <envVar name="LOG_LEVEL" value="INFO"/>
</env>
```

## Related Files

- `create-exe-launch4j.bat` - Standard script with env var support
- `create-exe-launch4j-with-classpath.bat` - Enhanced script with easier editing
- `launch4j-config.xml` - Generated Launch4j configuration (temporary)

## See Also

- [Launch4j Documentation](http://launch4j.sourceforge.net/docs.html)
- `README-EXE.md` - Executable creation guide
- `HOW-TO-RUN.md` - Application running guide

